import { openDB, IDBPDatabase } from 'idb';

export interface LocalNote {
  id: string;
  title: string;
  updatedAt: string;
}

const DB_NAME = 'omninote';
const STORE_NAME = 'notes_metadata';
const DB_VERSION = 1;

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
 * Retrieve all local note metadata sorted by updatedAt desc.
 */
export async function getAllLocalNotes(): Promise<LocalNote[]> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME) as LocalNote[];
  return all.sort((a, b) => {
    const timeA = a.updatedAt || '';
    const timeB = b.updatedAt || '';
    return timeB.localeCompare(timeA);
  });
}

/**
 * Insert or update a note's metadata.
 */
export async function putLocalNote(note: LocalNote): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, note);
}

/**
 * Delete a note's metadata entry.
 */
export async function deleteLocalNote(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

/**
 * Upsert a list of notes (used to merge server list into local DB).
 */
export async function mergeServerNotes(notes: LocalNote[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all([
    ...notes.map((note) => tx.store.put(note)),
    tx.done,
  ]);
}

/**
 * Wipes out all local IndexedDB notes data.
 * Useful for securely clearing local context upon logout.
 */
export async function clearAllOfflineData(): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) return;

  const notes = await getAllLocalNotes();

  for (const note of notes) {
    window.indexedDB.deleteDatabase(note.id);
  }
  window.indexedDB.deleteDatabase(DB_NAME);

  dbPromise = null;
}
