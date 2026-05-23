import { openDB, IDBPDatabase } from 'idb';

export interface LocalNote {
  id: string;
  title: string;
  updatedAt: string;
  syncState?: 'synced' | 'deleted' | 'created';
}

const DB_NAME = 'omninote';
const STORE_NAME = 'notes_metadata';
const DB_VERSION = 1;

class NoteEventEmitter {
  private listeners: (() => void)[] = [];
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  emit() {
    this.listeners.forEach(l => l());
  }
}

export const notesEmitter = new NoteEventEmitter();

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
        }
      },
      blocked() {
        // Handle blocked database connection
      },
      blocking() {
        // Handle blocking newer versions
      },
      terminated() {
        dbPromise = null;
      },
    }).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

/**
 * Retrieve all local note metadata sorted by updatedAt desc, excluding deleted ones.
 */
export async function getActiveLocalNotes(): Promise<LocalNote[]> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME) as LocalNote[];
  return all
    .filter(n => n.syncState !== 'deleted')
    .sort((a, b) => {
      const timeA = a.updatedAt || '';
      const timeB = b.updatedAt || '';
      return timeB.localeCompare(timeA);
    });
}

/**
 * Retrieve all notes that need to be synced (e.g. deleted offline).
 */
export async function getPendingSyncNotes(): Promise<LocalNote[]> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME) as LocalNote[];
  return all.filter(n => n.syncState === 'deleted');
}

export async function getPendingDeletions(): Promise<LocalNote[]> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME) as LocalNote[];
  return all.filter(n => n.syncState === 'deleted');
}

export async function getPendingCreations(): Promise<LocalNote[]> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME) as LocalNote[];
  return all.filter(n => n.syncState === 'created');
}

/**
 * Insert or update a note's metadata.
 */
export async function putLocalNote(note: LocalNote): Promise<void> {
  const db = await getDb();
  const existing = await db.get(STORE_NAME, note.id) as LocalNote | undefined;
  await db.put(STORE_NAME, {
    ...note,
    syncState: note.syncState ?? existing?.syncState ?? 'synced'
  });
  notesEmitter.emit();
}

/**
 * Soft delete a note (mark for deletion sync).
 */
export async function deleteLocalNote(id: string): Promise<void> {
  const db = await getDb();
  const existing = await db.get(STORE_NAME, id) as LocalNote | undefined;
  if (existing) {
    existing.syncState = 'deleted';
    existing.updatedAt = new Date().toISOString();
    await db.put(STORE_NAME, existing);
    notesEmitter.emit();
  }
}

/**
 * Hard delete a note (used after server confirms deletion or reconciling ghost notes).
 */
export async function hardDeleteLocalNote(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
  notesEmitter.emit();
}

/**
 * Upsert a list of notes (used to merge server list into local DB).
 */
export async function mergeServerNotes(serverNotes: LocalNote[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  
  // Create a map of server notes
  const serverNoteIds = new Set(serverNotes.map(n => n.id));
  
  // Get all current local notes
  const localNotes = await tx.store.getAll() as LocalNote[];
  
  // 1. Delete local notes that are no longer on the server
  // (unless they are pending sync operations like 'newly created', though offline creation saves them locally fast)
  for (const localNote of localNotes) {
    // If it's fully synced but missing from the server, the server deleted it.
    if (localNote.syncState === 'synced' && !serverNoteIds.has(localNote.id)) {
      await tx.store.delete(localNote.id);
    }
  }

  // 2. Put all server notes
  await Promise.all([
    ...serverNotes.map((note) => tx.store.put({ ...note, syncState: 'synced' })),
    tx.done,
  ]);
  
  // Emit change outside of transaction
  notesEmitter.emit();
}

/**
 * Wipes out all local IndexedDB notes data.
 * Useful for securely clearing local context upon logout.
 */
export async function clearAllOfflineData(): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) return;

  const db = await getDb();
  const notes = await db.getAll(STORE_NAME) as LocalNote[];

  for (const note of notes) {
    window.indexedDB.deleteDatabase(note.id);
  }
  window.indexedDB.deleteDatabase(DB_NAME);

  dbPromise = null;
}
