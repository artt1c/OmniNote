import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useNotes } from './useNotes';
import { useDocumentsHistory } from './useDocumentsHistory';
import { putLocalNote } from '@/lib/indexeddb-notes';

export function useWorkspace() {
  const router = useRouter();
  const { deleteNote, refetch: refetchNotes } = useNotes();
  const { removeDocument } = useDocumentsHistory();

  const createNewDocument = async () => {
    const id = uuidv4();
    // Persist metadata to IndexedDB immediately so it shows in the sidebar for both guests and authenticated users
    await putLocalNote({ id, title: 'Untitled', updatedAt: new Date().toISOString() });
    await refetchNotes();
    router.push(`/documents/${id}`);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      removeDocument(id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return {
    createNewDocument,
    handleDeleteNote,
  };
}

