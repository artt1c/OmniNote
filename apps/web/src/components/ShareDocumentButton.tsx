'use client';

import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { ShareDialog } from './ShareDialog';
import { useDocumentState } from '@/store/document-state';

export function ShareDocumentButton() {
  const { noteId, title } = useDocumentState();
  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!noteId) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 shrink-0 h-9"
        onClick={() => setIsShareOpen(true)}
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        noteId={noteId}
        noteTitle={title}
      />
    </>
  );
}
