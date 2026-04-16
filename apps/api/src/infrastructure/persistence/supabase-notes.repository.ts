import { Injectable } from '@nestjs/common';
import * as Y from 'yjs';
import { SupabasePersistenceService } from '@omninote/persistence';
import { NoteRepository } from '../../domain/notes/note.repository';
import { Note } from '../../domain/notes/note.entity';

/**
 * Infrastructure implementation of NoteRepository.
 * Delegates to the @omninote/persistence workspace package.
 */
@Injectable()
export class SupabaseNotesRepository extends NoteRepository {
  private readonly persistence: SupabasePersistenceService;

  constructor() {
    super();
    this.persistence = new SupabasePersistenceService();
  }

  async list(userId: string): Promise<Note[]> {
    const rows = await this.persistence.listNotes(userId);
    return rows.map((r) => new Note(r.id, r.title, r.updated_at));
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.persistence.deleteNote(id, userId);
  }

  async fetch(id: string, userId: string): Promise<Uint8Array | null> {
    return this.persistence.fetchNote(id, userId);
  }

  async store(id: string, doc: Y.Doc, userId: string): Promise<void> {
    await this.persistence.storeNote(id, doc, userId);
  }

  async sync(notes: { id: string; title: string }[], userId: string): Promise<void> {
    await this.persistence.syncNotes(notes, userId);
  }
}
