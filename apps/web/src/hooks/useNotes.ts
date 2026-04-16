import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from './useAuth';
import {
  getAllLocalNotes,
  deleteLocalNote,
  mergeServerNotes,
  type LocalNote,
} from '@/lib/indexeddb-notes';

export type { LocalNote as Note };

export function useNotes() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);

      // Always load from IndexedDB first (instant, offline-safe)
      const local = await getAllLocalNotes();
      setNotes(local);

      // If authenticated, merge in the server list so other devices' notes appear
      if (isAuthenticated) {
        try {
          const serverNotes = await fetchApi<{ id: string; title: string; updatedAt: string }[]>('/notes');
          const mapped: LocalNote[] = (serverNotes || []).map((n) => ({
            id: n.id,
            title: n.title,
            updatedAt: n.updatedAt || new Date().toISOString(),
          }));
          await mergeServerNotes(mapped);
          // Re-read after merge so state reflects both sources
          const merged = await getAllLocalNotes();
          setNotes(merged);
        } catch (serverError) {
          // Server unavailable — continue with local data
          console.warn('Could not fetch server notes, using local data:', serverError);
        }
      }
    } catch (e: any) {
      setError(e);
      console.error('Error fetching notes:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchNotes();
    }
  }, [isAuthLoading, fetchNotes]);

  const deleteNote = async (id: string) => {
    try {
      // Always delete locally first
      await deleteLocalNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));

      // If authenticated, also delete from server
      if (isAuthenticated) {
        await fetchApi(`/notes/${id}`, { method: 'DELETE' });
      }
    } catch (e: any) {
      console.error('Error deleting note:', e.message);
      throw e;
    }
  };

  return { notes, isLoading, error, refetch: fetchNotes, deleteNote };
}

