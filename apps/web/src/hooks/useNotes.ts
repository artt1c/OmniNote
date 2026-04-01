import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

export interface Note {
  id: string;
  title: string;
  updated_at: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi<Note[]>('/notes');
      setNotes(data || []);
    } catch (e: any) {
      setError(e);
      console.error('Error fetching notes:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const deleteNote = async (id: string) => {
    try {
      await fetchApi(`/notes/${id}`, { method: 'DELETE' });
      await fetchNotes();
    } catch (e: any) {
      console.error('Error deleting note:', e.message);
      throw e;
    }
  };

  return { notes, isLoading, error, refetch: fetchNotes, deleteNote };
}
