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

  async list(): Promise<Note[]> {
    const rows = await this.persistence.listNotes();
    return rows.map((r) => new Note(r.id, r.title, r.updated_at));
  }

  async delete(id: string): Promise<void> {
    await this.persistence.deleteNote(id);
  }

  async fetch(id: string): Promise<Uint8Array | null> {
    return this.persistence.fetchNote(id);
  }

  async store(id: string, doc: Y.Doc): Promise<void> {
    await this.persistence.storeNote(id, doc);
  }
}
