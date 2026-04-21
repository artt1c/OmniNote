import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
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

  @Get('search')
  async searchUsers(@Query('q') query: string): Promise<any[]> {
    return this.notesService.searchUsers(query);
  }

  @Get(':id/collaborators')
  async getCollaborators(@Param('id') id: string): Promise<any[]> {
    return this.notesService.getCollaborators(id);
  }

  @Post(':id/collaborators')
  async addCollaborator(
    @Param('id') id: string,
    @Body() body: { userId: string; permission: string },
    @User() user: { id: string }
  ): Promise<{ message: string }> {
    await this.notesService.addCollaborator(id, body.userId, body.permission, user.id);
    return { message: 'Collaborator added' };
  }

  @Delete(':id/collaborators/:userId')
  async removeCollaborator(
    @Param('id') id: string,
    @Param('userId') collaboratorId: string,
    @User() user: { id: string }
  ): Promise<{ message: string }> {
    await this.notesService.removeCollaborator(id, collaboratorId, user.id);
    return { message: 'Collaborator removed' };
  }

  @Patch(':id/public')
  async updatePublicAccess(
    @Param('id') id: string,
    @Body() body: { isPublic: boolean }
  ): Promise<{ message: string }> {
    await this.notesService.updatePublicAccess(id, body.isPublic);
    return { message: 'Public access updated' };
  }

  @Get(':id/public')
  async getPublicAccess(@Param('id') id: string): Promise<{ isPublic: boolean }> {
    const isPublic = await this.notesService.getPublicAccess(id);
    return { isPublic };
  }
}

