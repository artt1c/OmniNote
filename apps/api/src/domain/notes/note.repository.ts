import * as Y from 'yjs';
import { Note } from './note.entity';

/**
 * Abstract repository — defined in the domain layer.
 * Infrastructure layer provides the concrete implementation.
 */
export abstract class NoteRepository {
  abstract list(userId: string): Promise<Note[]>;
  abstract delete(id: string, userId: string): Promise<void>;
  abstract fetch(id: string, userId: string): Promise<Uint8Array | null>;
  abstract store(id: string, doc: Y.Doc, userId: string): Promise<void>;
  abstract sync(notes: { id: string; title: string }[], userId: string): Promise<void>;
}

