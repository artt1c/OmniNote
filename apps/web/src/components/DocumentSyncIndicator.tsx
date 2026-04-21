'use client';

import { CloudOff, Loader2, Check } from 'lucide-react';
import { useDocumentState } from '@/store/document-state';

export function DocumentSyncIndicator() {
  const { noteId, isOnline, isLocalSynced } = useDocumentState();

  if (!noteId) return null;

  return (
    <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 h-9 shrink-0">
      {!isOnline ? (
        <>
          <CloudOff className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span className="text-secondary hidden sm:inline">Offline</span>
        </>
      ) : !isLocalSynced ? (
        <>
          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
          <span className="text-primary hidden sm:inline">Syncing...</span>
        </>
      ) : (
        <>
          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
          <span className="text-green-500 hidden sm:inline">Synced</span>
        </>
      )}
    </div>
  );
}
