'use client';

import { useEffect } from 'react';
import { useDocumentsHistory } from '@/hooks/useDocumentsHistory';

export function HistoryTracker({ documentId }: { documentId: string }) {
  const { addDocument } = useDocumentsHistory();

  useEffect(() => {
    addDocument(documentId);
  }, [documentId]);

  return null;
}