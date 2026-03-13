import 'dotenv/config';
import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { createClient } from '@supabase/supabase-js';
import * as Y from 'yjs';
import {
  WS_PORT,
  NOTES_TABLE,
  NOTE_CONTENTS_TABLE,
  SUPABASE_URL,
  SUPABASE_KEY,
  SUPABASE_USER_ID
} from '@omninote/shared';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    'Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set.'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const server = new Server({
  port: WS_PORT,
  name: 'OmniNote Server',
  debounce: 2000,

  extensions: [
    new Database({
      async fetch({ documentName }) {
        const { data, error } = await supabase
          .from(NOTE_CONTENTS_TABLE)
          .select('data')
          .eq('note_id', documentName)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') {
            console.error(`[fetch] Supabase error for "${documentName}":`, error.message);
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
          const testDoc = new Y.Doc();
          Y.applyUpdate(testDoc, buffer);
          return buffer;
        } catch (e: any) {
          console.error(`❌ [fetch] Invalid Yjs data for "${documentName}":`, e.message);
          return null;
        }
      },

      async store({ documentName, document }) {
        const state = Y.encodeStateAsUpdate(document);
        const hexData = '\\x' + Buffer.from(state).toString('hex');

        const { error: nodeError } = await supabase.from(NOTES_TABLE).upsert(
          {
            id: documentName,
            owner_id: SUPABASE_USER_ID
          },
          { onConflict: 'id' },
        );

        if (nodeError) {
          console.error(`[store] Failed to ensure parent record for "${documentName}":`, nodeError.message);
          return;
        }

        const { error } = await supabase.from(NOTE_CONTENTS_TABLE).upsert({
          note_id: documentName,
          data: hexData,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error(`[store] Failed to persist "${documentName}":`, error.message);
          return;
        }

        console.log(`💾 Persisted state for: "${documentName}"`);
      },
    }),
  ],
});

server.listen().then(() => {
  console.log(`✅ Hocuspocus server is running on port ${WS_PORT}`);
});