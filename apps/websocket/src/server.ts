import { Server } from '@hocuspocus/server';
import { WS_PORT } from '@omninote/shared';
import {applyUpdate, encodeStateAsUpdate} from 'yjs';
import fs from 'fs';
import path from 'path';

const STORAGE_DIR = './storage';

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR);
}

const server = new Server({
  port: WS_PORT,
  name: 'OmniNote Server',

  debounce: 2000,

  async onLoadDocument(data) {
    const filePath = path.join(STORAGE_DIR, `${data.documentName}.bin`);

    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);

      if (buffer.length > 0) {
        console.log(`📂 Loading blob for: ${data.documentName} (${buffer.length} bytes)`);

        applyUpdate(data.document, new Uint8Array(buffer));
      }
    } else {
      console.log(`🆕 Creating new document: ${data.documentName}`);
    }

    return data.document;
  },

  async onStoreDocument(data) {
    const filePath = path.join(STORAGE_DIR, `${data.documentName}.bin`);

    const update = encodeStateAsUpdate(data.document);

    console.log(`💾 Saving blob for: ${data.documentName} (${update.length} bytes)`);

    fs.writeFileSync(filePath, Buffer.from(update));
  },
});

// Запускаємо
server.listen().then(() => {
  console.log(`Hocuspocus server is running on port ${WS_PORT}`);
});