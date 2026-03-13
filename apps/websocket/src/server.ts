import 'dotenv/config';
import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { SupabasePersistenceService } from '@omninote/persistence';
import { WS_PORT } from '@omninote/shared';

const persistence = new SupabasePersistenceService();

const server = new Server({
  port: WS_PORT,
  name: 'OmniNote Server',
  debounce: 2000,

  extensions: [
    new Database({
      async fetch({ documentName }) {
        return await persistence.fetchNote(documentName);
      },

      async store({ documentName, document }) {
        await persistence.storeNote(documentName, document);
      },
    }),
  ],
});

server.listen().then(() => {
  console.log(`✅ Hocuspocus server is running on port ${WS_PORT}`);
});