/**
 * Domain interface for note-related database operations.
 * Focuses on metadata and binary document snapshots.
 */
export interface INotesRepository {
  /**
   * Retrieves binary data (Yjs snapshot) for a given note.
   * @param noteId The unique identifier of the note.
   * @returns Binary data as a Buffer, or null if not found.
   */
  getBinaryData(noteId: string): Promise<Buffer | null>;

  /**
   * Saves binary data (Yjs snapshot) for a given note.
   * @param noteId The unique identifier of the note.
   * @param data The binary data to store.
   */
  saveBinaryData(noteId: string, data: Buffer): Promise<void>;
}

/**
 * Injection token for INotesRepository.
 */
export const INotesRepository = Symbol('INotesRepository');
