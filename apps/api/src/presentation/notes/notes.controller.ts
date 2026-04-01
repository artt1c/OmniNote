import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
} from '@nestjs/common';
import { NotesService } from '../../application/notes/notes.service';
import { NoteDto } from '../../application/notes/dto/note.dto';

/**
 * REST controller — presentation layer.
 * Handles HTTP concerns only (routing, status codes, serialisation).
 * All business logic lives in NotesService.
 */
@Controller('notes')
export class NotesController {
  constructor(
    @Inject(NotesService) private readonly notesService: NotesService,
  ) {}

  @Get()
  async listNotes(): Promise<NoteDto[]> {
    return this.notesService.listNotes();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNote(@Param('id') id: string): Promise<{ message: string }> {
    await this.notesService.deleteNote(id);
    return { message: 'Note deleted' };
  }
}
