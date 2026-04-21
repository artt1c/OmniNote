import * as Y from 'yjs';
import { Note } from './note.entity';

export abstract class NoteRepository {
  abstract list(userId: string): Promise<Note[]>;
  abstract delete(id: string, userId: string): Promise<void>;
  abstract fetch(id: string, userId: string): Promise<Uint8Array | null>;
  abstract store(id: string, doc: Y.Doc, userId: string): Promise<void>;
  abstract sync(notes: { id: string; title: string }[], userId: string): Promise<void>;

  // Collaboration
  abstract searchUsers(query: string): Promise<any[]>;
  abstract getCollaborators(noteId: string): Promise<any[]>;
  abstract addCollaborator(noteId: string, userId: string, permission: string, requesterId: string): Promise<void>;
  abstract removeCollaborator(noteId: string, userId: string, requesterId: string): Promise<void>;
  abstract updateNotePublicAccess(noteId: string, isPublic: boolean): Promise<void>;
  abstract getNotePublicAccess(noteId: string): Promise<boolean>;
}
