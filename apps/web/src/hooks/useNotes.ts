import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from './useAuth';
import {
  getActiveLocalNotes,
  getPendingDeletions,
  getPendingCreations,
  deleteLocalNote,
  hardDeleteLocalNote,
  putLocalNote,
  mergeServerNotes,
  notesEmitter,
  type LocalNote,
} from '@/lib/indexeddb-notes';

export type { LocalNote as Note };

export function useNotes() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 1. Reactive UI Layer
  const loadLocalNotes = useCallback(async () => {
    try {
      const activeNotes = await getActiveLocalNotes();
      setNotes(activeNotes);
    } catch (e: any) {
      console.error('Error loading local notes:', e);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    loadLocalNotes();

    // Subscribe to DB changes
    const unsubscribe = notesEmitter.subscribe(loadLocalNotes);
    return () => unsubscribe();
  }, [loadLocalNotes]);

  // 2. Background Sync Worker
  const syncWithServer = useCallback(async () => {
    if (!isAuthenticated || (typeof navigator !== 'undefined' && !navigator.onLine)) return;

    try {
      // Step A: Push offline deletions
      const pendingDeletions = await getPendingDeletions();
      for (const note of pendingDeletions) {
        try {
          await fetchApi(`/notes/${note.id}`, { method: 'DELETE' });
          await hardDeleteLocalNote(note.id); // Permanently remove once server confirms
        } catch (e) {
          console.error('Failed to sync deletion for note:', note.id, e);
        }
      }

      // Step B: Push offline creations
      const pendingCreations = await getPendingCreations();
      if (pendingCreations.length > 0) {
        try {
          await fetchApi('/notes/sync', {
            method: 'POST',
            body: JSON.stringify(pendingCreations.map((c) => ({ id: c.id, title: c.title }))),
          });
          // Update local syncState to 'synced' once server confirms
          for (const note of pendingCreations) {
            await putLocalNote({ ...note, syncState: 'synced' });
          }
        } catch (e) {
          console.error('Failed to sync creations for notes:', e);
        }
      }

      // Step C: Pull server list
      const serverNotes = await fetchApi<{ id: string; title: string; updatedAt: string }[]>('/notes');
      if (serverNotes) {
        const mapped: LocalNote[] = serverNotes.map((n) => ({
          id: n.id,
          title: n.title,
          updatedAt: n.updatedAt || new Date().toISOString(),
        }));
        await mergeServerNotes(mapped);
      }
    } catch (e: any) {
      console.warn('Background sync failed:', e.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      syncWithServer();
    }
    
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        if (isAuthenticated) syncWithServer();
      };
      window.addEventListener('online', handleOnline);
      return () => window.removeEventListener('online', handleOnline);
    }
  }, [isAuthLoading, isAuthenticated, syncWithServer]);

  // UI Actions
  const deleteNote = async (id: string) => {
    try {
      // Mark as deleted locally. UI updates immediately via EventEmitter.
      await deleteLocalNote(id);
      
      // Attempt to sync immediately
      syncWithServer();
    } catch (e: any) {
      console.error('Error deleting note:', e.message);
      throw e;
    }
  };

  return { notes, isLoading, error, refetch: syncWithServer, deleteNote };
}

