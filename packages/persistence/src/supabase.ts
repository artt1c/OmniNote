import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as Y from 'yjs';
import {
  NOTES_TABLE,
  NOTE_CONTENTS_TABLE,
  PROFILES_TABLE,
  SUPABASE_URL,
  SUPABASE_KEY,
  getSupabaseConfig
} from '@omninote/shared';

export class SupabasePersistenceService {
  private supabase: SupabaseClient;

  constructor(url: string = SUPABASE_URL, key: string = SUPABASE_KEY) {
    if (!url || !key) {
      throw new Error('Supabase URL and Key are required for persistence');
    }
    this.supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
  }

  async fetchNote(noteId: string, ownerId: string): Promise<Uint8Array | null> {
    const { data, error } = await this.supabase
      .from(NOTE_CONTENTS_TABLE)
      .select('data')
      .eq('note_id', noteId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error(`[fetch] Supabase error for "${noteId}":`, error.message);
      }
      return null;
    }

    const raw = data?.data;
    if (!raw) return null;

    let buffer: Uint8Array;

    if (raw instanceof Uint8Array) {
      buffer = raw;
    } else if (typeof raw === 'string' && raw.startsWith('\\x')) {
      buffer = Buffer.from(raw.slice(2), 'hex');
    } else {
      buffer = Buffer.from(raw as any);
    }

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
    const hexData = '\\x' + Buffer.from(state).toString('hex');

    // Extract title from Yjs metadata
    const metadata = document.getMap('metadata');
    const title = metadata.get('title') as string || 'Untitled';

    // Ensure parent record exists
    const { error: nodeError } = await this.supabase.from(NOTES_TABLE).upsert(
      {
        id: noteId,
        owner_id: ownerId,
        title: title
      },
      { onConflict: 'id' }
    );

    if (nodeError) {
      console.error(`[store] Failed to ensure parent record for "${noteId}":`, nodeError.message);
      return;
    }

    const { error } = await this.supabase.from(NOTE_CONTENTS_TABLE).upsert({
      note_id: noteId,
      data: hexData,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`[store] Failed to persist "${noteId}":`, error.message);
      return;
    }

    console.log(`💾 Persisted state for: "${noteId}"`);
  }

  async listNotes(ownerId: string): Promise<{ id: string, title: string, updated_at: string }[]> {
    const { data, error } = await this.supabase
      .from(NOTES_TABLE)
      .select('id, title, updated_at')
      .eq('owner_id', ownerId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[listNotes] Supabase error:', error.message);
      return [];
    }

    return data || [];
  }

  async deleteNote(noteId: string, ownerId: string): Promise<void> {
    const { error: contentError } = await this.supabase
      .from(NOTE_CONTENTS_TABLE)
      .delete()
      .eq('note_id', noteId);

    if (contentError) {
      console.error(`[delete] Failed to delete content for "${noteId}":`, contentError.message);
    }

    const { error: noteError } = await this.supabase
      .from(NOTES_TABLE)
      .delete()
      .eq('id', noteId)
      .eq('owner_id', ownerId);

    if (noteError) {
      console.error(`[delete] Failed to delete note record for "${noteId}":`, noteError.message);
      throw new Error(`Failed to delete note: ${noteError.message}`);
    }

    console.log(`🗑️ Deleted note: "${noteId}"`);
  }

  /**
   * Upsert note metadata (id + title) without overriding content.
   * Used to register locally-created guest notes in the server DB after login.
   */
  async syncNotes(notes: { id: string; title: string }[], ownerId: string): Promise<void> {
    if (notes.length === 0) return;

    const rows = notes.map((n) => ({
      id: n.id,
      owner_id: ownerId,
      title: n.title,
    }));

    const { error } = await this.supabase
      .from(NOTES_TABLE)
      .upsert(rows, { onConflict: 'id', ignoreDuplicates: false });

    if (error) {
      console.error('[syncNotes] Failed to sync notes:', error.message);
      throw new Error(`Failed to sync notes: ${error.message}`);
    }

    console.log(`🔄 Synced ${notes.length} note(s) to server`);
  }

  async verifyToken(token: string): Promise<{ id: string } | null> {
    try {
      const { data, error } = await this.supabase.auth.getUser(token);
      if (error || !data.user) {
        return null;
      }
      return { id: data.user.id };
    } catch {
      return null;
    }
  }

  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signUp(email: string, password: string, name: string) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
  }

  async createProfile(userId: string, username: string, avatarUrl: string): Promise<void> {
    const { url, key } = getSupabaseConfig();
    // Create a dedicated client for this admin operation to ensure 
    // it's not affected by any existing session context on the main client.
    const adminClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    const { error } = await adminClient
      .from(PROFILES_TABLE)
      .insert({
        id: userId,
        username,
        avatar_url: avatarUrl,
      });

    if (error) {
      console.error('[createProfile] Failed to create user profile:', error.message);
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    console.log(`👤 Created profile for user: ${username}`);
  }

  async getProfile(userId: string): Promise<{ username: string; avatar_url: string } | null> {
    const { data, error } = await this.supabase
      .from(PROFILES_TABLE)
      .select('username, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is 'no rows found'
        console.error('[getProfile] Failed to fetch profile:', error.message);
      }
      return null;
    }

    return data;
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
