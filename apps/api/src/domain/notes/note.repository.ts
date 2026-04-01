import * as Y from 'yjs';
import { Note } from './note.entity';

/**
 * Abstract repository — defined in the domain layer.
 * Infrastructure layer provides the concrete implementation.
 */
export abstract class NoteRepository {
  abstract list(): Promise<Note[]>;
  abstract delete(id: string): Promise<void>;
  abstract fetch(id: string): Promise<Uint8Array | null>;
  abstract store(id: string, doc: Y.Doc): Promise<void>;
}
