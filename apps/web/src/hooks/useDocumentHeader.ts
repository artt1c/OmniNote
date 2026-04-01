'use client';

import * as Y from 'yjs';
import { useState, useEffect } from 'react';
import { useDocumentsHistory } from '@/hooks/useDocumentsHistory';

export function useDocumentHeader(documentId: string, ydoc: Y.Doc | null) {
  const { documents, updateDocumentTitle: updateLocalHistory } = useDocumentsHistory();
  const document = documents.find((doc) => doc.id === documentId);

  const [title, setTitle] = useState(document?.title || '');
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    if (document?.title && (title === '' || title === 'Untitled')) {
      setTitle(document.title);
    }
  }, [document?.title]);

  useEffect(() => {
    if (!ydoc) return;

    const metadata = ydoc.getMap('metadata');

    const yTitle = metadata.get('title') as string;
    if (yTitle) {
      if (yTitle !== title) {
        setTitle(yTitle);
        updateLocalHistory(documentId, yTitle);
      }
    } else if (title) {
      metadata.set('title', title);
    }

    const observeMetadata = () => {
      const updatedTitle = metadata.get('title') as string;
      if (updatedTitle !== undefined && updatedTitle !== title) {
        setTitle(updatedTitle);
        updateLocalHistory(documentId, updatedTitle);
      }
    };

    metadata.observe(observeMetadata);
    return () => metadata.unobserve(observeMetadata);
  }, [ydoc, documentId, title]);

  useEffect(() => {
    const calculateRelativeTime = () => {
      const time = document?.lastVisited || Date.now();
      const diff = Date.now() - time;
      const minutes = Math.floor(diff / 60000);

      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    setRelativeTime(calculateRelativeTime());
    const interval = setInterval(() => {
      setRelativeTime(calculateRelativeTime());
    }, 60000);

    return () => clearInterval(interval);
  }, [document?.lastVisited]);

  const onTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    // Update Yjs (this will trigger the observer and update history)
    if (ydoc) {
      const metadata = ydoc.getMap('metadata');
      metadata.set('title', newTitle || 'Untitled');
    } else {
      // Fallback to local history if ydoc not ready
      updateLocalHistory(documentId, newTitle || 'Untitled');
    }
  };

  return {
    title,
    relativeTime,
    onTitleChange
  };
}
