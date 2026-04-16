import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from '../../application/notes/notes.service';
import { NoteDto } from '../../application/notes/dto/note.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { User } from '../auth/decorators/user.decorator';

class SyncNoteItemDto {
  id!: string;
  title!: string;
}

/**
 * REST controller — presentation layer.
 * Handles HTTP concerns only (routing, status codes, serialisation).
 * All business logic lives in NotesService.
 */
@Controller('notes')
@UseGuards(SupabaseAuthGuard)
export class NotesController {
  constructor(
    @Inject(NotesService) private readonly notesService: NotesService,
  ) {}

  @Get()
  async listNotes(@User() user: { id: string }): Promise<NoteDto[]> {
    return this.notesService.listNotes(user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNote(
    @Param('id') id: string,
    @User() user: { id: string }
  ): Promise<{ message: string }> {
    await this.notesService.deleteNote(id, user.id);
    return { message: 'Note deleted' };
  }

  /**
   * Sync local guest notes metadata to the server.
   * Called once after login; Yjs will handle the actual content sync via WebSocket.
   */
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncNotes(
    @Body() notes: SyncNoteItemDto[],
    @User() user: { id: string }
  ): Promise<{ message: string }> {
    await this.notesService.syncNotes(notes, user.id);
    return { message: `Synced ${notes.length} note(s)` };
  }
}

