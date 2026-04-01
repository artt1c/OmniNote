import { useState, useEffect } from 'react';
import { STORAGE_KEY } from '@omninote/shared';

export interface StoredDocument {
  id: string;
  title: string;
  lastVisited: number;
}

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

  const addDocument = (id: string, title: string = 'Untitled') => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: StoredDocument[] = stored ? JSON.parse(stored) : [];

      const existing = list.find((doc) => doc.id === id);
      const newTitle = existing ? existing.title : title;

      list = list.filter((doc) => doc.id !== id);
      list.unshift({ id, title: newTitle, lastVisited: Date.now() });

      if (list.length > 10) list = list.slice(0, 10);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setDocuments(list);
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const updateDocumentTitle = (id: string, title: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: StoredDocument[] = stored ? JSON.parse(stored) : [];

      list = list.map((doc) => 
        doc.id === id ? { ...doc, title, lastVisited: Date.now() } : doc
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setDocuments(list);
    } catch (e) {
      console.error('Failed to update title', e);
    }
  };

  const removeDocument = (id: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: StoredDocument[] = stored ? JSON.parse(stored) : [];

      list = list.filter((doc) => doc.id !== id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setDocuments(list);
    } catch (e) {
      console.error('Failed to remove from history', e);
    }
  };

  return { documents, addDocument, updateDocumentTitle, removeDocument };
}