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

  async listNotes(): Promise<NoteDto[]> {
    const notes = await this.noteRepository.list();
    return notes.map(
      (n) => new NoteDto(n.id, n.title, n.updatedAt),
    );
  }

  async deleteNote(id: string): Promise<void> {
    await this.noteRepository.delete(id);
  }
}
