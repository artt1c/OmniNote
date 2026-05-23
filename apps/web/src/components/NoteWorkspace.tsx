'use client';

import { useDocumentHeader } from '@/hooks/useDocumentHeader';
import { useCollaborativeEditor } from '@/hooks/useCollaborativeEditor';
import { DocumentHeader } from './DocumentHeader';
import { CollaborativeEditor } from './CollaborativeEditor';

interface NoteWorkspaceProps {
  documentId: string;
}

export function NoteWorkspace({ documentId }: NoteWorkspaceProps) {
  const { editor, isOnline, isLocalSynced, ydoc } = useCollaborativeEditor(documentId);
  const { title, relativeTime, onTitleChange } = useDocumentHeader(documentId, ydoc);
  return (
    <div className="w-full max-w-[700px] mx-auto px-4 md:px-0">
      <DocumentHeader
        noteId={documentId}
        title={title}
        relativeTime={relativeTime}
        onTitleChange={onTitleChange}
        isOnline={isOnline}
        isLocalSynced={isLocalSynced}
      />
      <div className="mt-8">
        <CollaborativeEditor editor={editor} noteId={documentId} />
      </div>
    </div>
  );
}
