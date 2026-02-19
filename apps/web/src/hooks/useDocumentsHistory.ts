import { useState, useEffect } from 'react';

export interface StoredDocument {
  id: string;
  lastVisited: number;
}

const STORAGE_KEY = 'omninote-recent-docs';

export function useDocumentsHistory() {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDocuments(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse history', e);
    }
  }, []);

  const addDocument = (id: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: StoredDocument[] = stored ? JSON.parse(stored) : [];

      list = list.filter((doc) => doc.id !== id);

      list.unshift({ id, lastVisited: Date.now() });

      if (list.length > 10) list = list.slice(0, 10);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setDocuments(list);
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  return { documents, addDocument };
}