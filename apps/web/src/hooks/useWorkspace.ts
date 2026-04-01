import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useNotes } from './useNotes';
import { useDocumentsHistory } from './useDocumentsHistory';

export function useWorkspace() {
  const router = useRouter();
  const { deleteNote, refetch: refetchNotes } = useNotes();
  const { removeDocument } = useDocumentsHistory();

  const createNewDocument = () => {
    const id = uuidv4();
    router.push(`/documents/${id}`);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      removeDocument(id);
      await refetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return {
    createNewDocument,
    handleDeleteNote,
  };
}
