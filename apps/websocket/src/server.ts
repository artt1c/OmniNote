import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { Hocuspocus } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { SupabasePersistenceService } from '@omninote/persistence';

const persistence = new SupabasePersistenceService();

const app = express();
app.use(cors());

app.get('/notes', async (req, res) => {
  try {
    const notes = await persistence.listNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await persistence.deleteNote(id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

const hocuspocus = new Hocuspocus({
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

const httpServer = http.createServer(app);

const wss = new WebSocketServer({ noServer: true });

httpServer.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    hocuspocus.handleConnection(ws, request);
  });
});

const PORT = process.env.PORT || 8080;

// Start the server
httpServer.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});