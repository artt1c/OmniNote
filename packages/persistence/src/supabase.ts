import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as Y from 'yjs';
import {
  NOTES_TABLE,
  NOTE_CONTENTS_TABLE,
  SUPABASE_URL,
  SUPABASE_KEY,
  SUPABASE_USER_ID
} from '@omninote/shared';

export class SupabasePersistenceService {
  private supabase: SupabaseClient;

  constructor(url: string = SUPABASE_URL, key: string = SUPABASE_KEY) {
    if (!url || !key) {
      throw new Error('Supabase URL and Key are required for persistence');
    }
    this.supabase = createClient(url, key);
  }

  async fetchNote(noteId: string): Promise<Uint8Array | null> {
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

  async storeNote(noteId: string, document: Y.Doc): Promise<void> {
    const state = Y.encodeStateAsUpdate(document);
    const hexData = '\\x' + Buffer.from(state).toString('hex');

    // Extract title from Yjs metadata
    const metadata = document.getMap('metadata');
    const title = metadata.get('title') as string || 'Untitled';

    // Ensure parent record exists
    const { error: nodeError } = await this.supabase.from(NOTES_TABLE).upsert(
      {
        id: noteId,
        owner_id: SUPABASE_USER_ID,
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

  async listNotes(): Promise<{ id: string, title: string, updated_at: string }[]> {
    const { data, error } = await this.supabase
      .from(NOTES_TABLE)
      .select('id, title, updated_at')
      .eq('owner_id', SUPABASE_USER_ID)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[listNotes] Supabase error:', error.message);
      return [];
    }

    return data || [];
  }

  async deleteNote(noteId: string): Promise<void> {
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
      .eq('id', noteId);

    if (noteError) {
      console.error(`[delete] Failed to delete note record for "${noteId}":`, noteError.message);
      throw new Error(`Failed to delete note: ${noteError.message}`);
    }

    console.log(`🗑️ Deleted note: "${noteId}"`);
  }
}
