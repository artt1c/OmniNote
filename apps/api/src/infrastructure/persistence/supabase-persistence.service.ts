import { Injectable, Inject } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CollaboratorPermission } from '@prisma/client';
import * as Y from 'yjs';
import {
  SUPABASE_URL,
  SUPABASE_KEY,
  getSupabaseConfig
} from '@omninote/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupabasePersistenceService {
  private supabase: SupabaseClient;

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('Supabase URL and Key are required for auth persistence');
    }
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
  }

  async fetchNote(noteId: string, userId: string): Promise<Uint8Array | null> {
    const hasAccess = await this.checkPermission(noteId, userId, 'read');
    if (!hasAccess) return null;

    const content = await this.prisma.noteContent.findUnique({
      where: { noteId }
    });

    if (!content || !content.data) return null;

    const buffer = new Uint8Array(content.data);

    try {
      // Validate Yjs data
      const testDoc = new Y.Doc();
      Y.applyUpdate(testDoc, buffer);
      return buffer;
    } catch (e: any) {
      console.error(`❌ [fetch] Invalid Yjs data for "${noteId}":`, e.message);
      return null;
    }
  }

  async storeNote(noteId: string, document: Y.Doc, ownerId: string): Promise<void> {
    const state = Y.encodeStateAsUpdate(document);
    const metadata = document.getMap('metadata');
    const title = metadata.get('title') as string || 'Untitled';

    const existingNote = await this.prisma.note.findUnique({
      where: { id: noteId }
    });

    if (existingNote) {
      const hasAccess = await this.checkPermission(noteId, ownerId, 'write');
      if (!hasAccess) {
        console.error(`[store] Unauthorized attempt to save "${noteId}" by user "${ownerId}"`);
        return;
      }
    }

    // Use a transaction to ensure both note and content are saved
    await this.prisma.$transaction(async (tx) => {
      await tx.note.upsert({
        where: { id: noteId },
        update: { title, updatedAt: new Date() },
        create: { id: noteId, ownerId, title }
      });

      await tx.noteContent.upsert({
        where: { noteId },
        update: { data: Buffer.from(state), updatedAt: new Date() },
        create: { noteId, data: Buffer.from(state) }
      });
    });

    console.log(`💾 Persisted state for: "${noteId}"`);
  }

  async listNotes(userId: string): Promise<{ id: string, title: string, updated_at: string }[]> {
    const notes = await this.prisma.note.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } }
        ]
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true
      }
    });

    return notes.map(n => ({
      id: n.id,
      title: n.title,
      updated_at: n.updatedAt.toISOString()
    }));
  }

  async updateNotePublicAccess(noteId: string, isPublic: boolean) {
    return this.prisma.note.update({
      where: { id: noteId },
      data: { isPublic }
    });
  }

  async getPublicAccess(noteId: string): Promise<boolean> {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      select: { isPublic: true }
    });
    return note?.isPublic || false;
  }

  async checkPermission(noteId: string, userId: string, permission: 'read' | 'write'): Promise<boolean> {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      select: { ownerId: true, isPublic: true }
    });

    if (!note) return true;
    if (note.ownerId === userId) return true;
    if (permission === 'read' && note.isPublic) return true;

    const collab = await this.prisma.noteCollaborator.findUnique({
      where: {
        noteId_userId: { noteId, userId }
      }
    });

    if (collab) {
      if (permission === 'read') return true;
      if (collab.permission === CollaboratorPermission.WRITE) return true;
    }

    return false;
  }

  async searchProfiles(query: string) {
    // 1. Search profiles by username or email
    const profiles = await this.prisma.profile.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 10,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        email: true
      }
    });

    return { data: profiles, error: null };
  }

  async getCollaborators(noteId: string) {
    const collabs = await this.prisma.noteCollaborator.findMany({
      where: { noteId },
      include: {
        profile: {
          select: {
            username: true,
            avatarUrl: true,
            email: true
          }
        }
      }
    });

    // Format to match old Supabase output for repository compatibility
    const data = collabs.map((c: any) => ({
      user_id: c.userId,
      permission: c.permission.toLowerCase(),
      profiles: {
        username: c.profile.username,
        avatar_url: c.profile.avatarUrl
      }
    }));

    return { data, error: null };
  }

  async addCollaborator(noteId: string, collaboratorId: string, permission: string, requesterId: string) {
    // 1. Check if note exists. If not, the requester becomes the owner.
    let note = await this.prisma.note.findUnique({ where: { id: noteId } });

    if (!note) {
      note = await this.prisma.note.create({
        data: { id: noteId, ownerId: requesterId, title: 'Untitled' }
      });
    }

    // 2. Check if requester has authority (must be owner)
    if (note.ownerId !== requesterId) {
      throw new Error('Only the owner can add collaborators');
    }

    const perm = permission.toUpperCase() === 'WRITE' ? CollaboratorPermission.WRITE : CollaboratorPermission.READ;
    return this.prisma.noteCollaborator.upsert({
      where: {
        noteId_userId: { noteId, userId: collaboratorId }
      },
      update: { permission: perm },
      create: { noteId, userId: collaboratorId, permission: perm }
    });
  }

  async removeCollaborator(noteId: string, collaboratorId: string, requesterId: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return; // Nothing to remove

    // Requester must be owner OR removing themselves
    if (note.ownerId !== requesterId && collaboratorId !== requesterId) {
      throw new Error('Unauthorized to remove this collaborator');
    }

    return this.prisma.noteCollaborator.delete({
      where: {
        noteId_userId: { noteId, userId: collaboratorId }
      }
    });
  }

  async deleteNote(noteId: string, ownerId: string): Promise<void> {
    // Cascade delete is handled by Prisma/DB constraints
    await this.prisma.note.delete({
      where: { id: noteId, ownerId }
    });
    console.log(`🗑️ Deleted note: "${noteId}"`);
  }

  async syncNotes(notes: { id: string; title: string }[], ownerId: string): Promise<void> {
    if (notes.length === 0) return;

    await this.prisma.$transaction(
      notes.map(n =>
        this.prisma.note.upsert({
          where: { id: n.id },
          create: { id: n.id, title: n.title, ownerId },
          update: { title: n.title } // Don't override owner
        })
      )
    );

    console.log(`🔄 Synced ${notes.length} note(s) to server`);
  }

  async getNoteMetadata(noteId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      select: { ownerId: true, isPublic: true, title: true }
    });
    return { data: note, error: note ? null : new Error('Not found') };
  }

  // --- Auth Methods (Keep using Supabase) ---

  async verifyToken(token: string): Promise<{ id: string } | null> {
    try {
      const { data, error } = await this.supabase.auth.getUser(token);
      if (error || !data.user) return null;
      return { id: data.user.id };
    } catch {
      return null;
    }
  }

  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async refreshSession(refreshToken: string) {
    return this.supabase.auth.refreshSession({ refresh_token: refreshToken });
  }

  async signUp(email: string, password: string, name: string) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
  }

  async createProfile(userId: string, username: string, avatarUrl: string, email?: string): Promise<void> {
    await this.prisma.profile.create({
      data: {
        id: userId,
        username,
        avatarUrl,
        email
      }
    });
    console.log(`👤 Created profile for user: ${username}`);
  }

  async getProfile(userId: string): Promise<{ username: string; avatar_url: string } | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { username: true, avatarUrl: true }
    });

    if (!profile) return null;
    return {
      username: profile.username || 'User',
      avatar_url: profile.avatarUrl || ''
    };
  }

  async getAuthUser(userId: string): Promise<{ email: string; metadata: any } | null> {
    const { data, error } = await this.supabase.auth.admin.getUserById(userId);

    if (error || !data.user) {
      if (error && error.status !== 404) {
        console.error('[getAuthUser] Failed to fetch auth user:', error.message);
      }
      return null;
    }

    return {
      email: data.user.email || '',
      metadata: data.user.user_metadata || {}
    };
  }
}
