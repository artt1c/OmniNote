import { Injectable, Inject } from '@nestjs/common';
import { NoteRepository } from '../../domain/notes/note.repository';
import { NoteDto } from './dto/note.dto';

/**
 * Application service — orchestrates use cases.
 * Depends only on the domain abstraction (NoteRepository),
 * not on any infrastructure details.
 */
@Injectable()
export class NotesService {
  constructor(
    @Inject(NoteRepository) private readonly noteRepository: NoteRepository,
  ) {}

  async listNotes(userId: string): Promise<NoteDto[]> {
    const notes = await this.noteRepository.list(userId);
    return notes.map(
      (n) => new NoteDto(n.id, n.title, n.updatedAt),
    );
  }

  async deleteNote(id: string, userId: string): Promise<void> {
    await this.noteRepository.delete(id, userId);
  }

  async syncNotes(notes: { id: string; title: string }[], userId: string): Promise<void> {
    await this.noteRepository.sync(notes, userId);
  }
}
