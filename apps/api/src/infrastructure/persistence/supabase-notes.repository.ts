import { Injectable, Inject } from '@nestjs/common';
import * as Y from 'yjs';
import { SupabasePersistenceService } from './supabase-persistence.service';
import { NoteRepository } from '../../domain/notes/note.repository';
import { Note } from '../../domain/notes/note.entity';

/**
 * Infrastructure implementation of NoteRepository.
 */
@Injectable()
export class SupabaseNotesRepository extends NoteRepository {
  constructor(
    @Inject(SupabasePersistenceService) private readonly persistence: SupabasePersistenceService
  ) {
    super();
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

  async searchUsers(query: string): Promise<any[]> {
    const { data } = await this.persistence.searchProfiles(query);
    return data || [];
  }

  async getCollaborators(noteId: string): Promise<any[]> {
    const metadataResult = await this.persistence.getNoteMetadata(noteId);
    const note = metadataResult.data;

    const collaboratorsResult = await this.persistence.getCollaborators(noteId);
    const collaboratorRows = collaboratorsResult.data || [];

    interface CollaboratorItem {
      userId: string;
      permission: string;
      username: string;
      avatarUrl?: string;
      email?: string;
      isOwner: boolean;
    }

    const collaboratorList: CollaboratorItem[] = await Promise.all(collaboratorRows.map(async (c: any) => {
      try {
        let profile = c.profiles;
        if (!profile) {
          profile = await this.persistence.getProfile(c.user_id).catch(() => null);
        }

        const authUser = await this.persistence.getAuthUser(c.user_id).catch(() => null);

        return {
          userId: c.user_id,
          permission: c.permission,
          username: profile?.username || 'Unknown User',
          avatarUrl: profile?.avatar_url || undefined,
          email: authUser?.email || undefined,
          isOwner: c.user_id === note?.ownerId
        };
      } catch (err) {
        console.error(`[getCollaborators] Failed to fetch data for user ${c.user_id}:`, err);
        return {
          userId: c.user_id,
          permission: c.permission,
          username: 'User',
          avatarUrl: undefined,
          email: undefined,
          isOwner: false
        };
      }
    }));

    if (note && !collaboratorList.find(c => c.userId === note.ownerId)) {
      const ownerProfile = await this.persistence.getProfile(note.ownerId);
      const ownerAuth = await this.persistence.getAuthUser(note.ownerId);
      collaboratorList.unshift({
        userId: note.ownerId,
        permission: 'owner',
        username: ownerProfile?.username || 'Owner',
        avatarUrl: ownerProfile?.avatar_url || undefined,
        email: ownerAuth?.email || undefined,
        isOwner: true
      });
    }

    return collaboratorList;
  }

  async addCollaborator(noteId: string, userId: string, permission: string, requesterId: string): Promise<void> {
    await this.persistence.addCollaborator(noteId, userId, permission, requesterId);
  }

  async updateNotePublicAccess(noteId: string, isPublic: boolean): Promise<void> {
    await this.persistence.updateNotePublicAccess(noteId, isPublic);
  }

  async getNotePublicAccess(noteId: string): Promise<boolean> {
    return this.persistence.getPublicAccess(noteId);
  }

  async removeCollaborator(noteId: string, userId: string, requesterId: string): Promise<void> {
    await this.persistence.removeCollaborator(noteId, userId, requesterId);
  }
}
