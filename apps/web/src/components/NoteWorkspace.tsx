'use client';

import { useDocumentHeader } from '@/hooks/useDocumentHeader';
import { useCollaborativeEditor } from '@/hooks/useCollaborativeEditor';
import { DocumentHeader } from './DocumentHeader';
import { CollaborativeEditor } from './CollaborativeEditor';

interface NoteWorkspaceProps {
  documentId: string;
}

export function NoteWorkspace({ documentId }: NoteWorkspaceProps) {
  const { editor, isLocalSynced, ydoc } = useCollaborativeEditor(documentId);
  const { title, relativeTime, onTitleChange } = useDocumentHeader(documentId, ydoc);

  if (!isLocalSynced) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-background rounded-lg border-2 border-dashed border-border w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-secondary font-medium">Loading local data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[700px] mx-auto px-6 lg:px-0">
      <DocumentHeader 
        title={title} 
        relativeTime={relativeTime} 
        onTitleChange={onTitleChange} 
      />
      <div className="mt-8">
        <CollaborativeEditor editor={editor} />
      </div>
    </div>
  );
}
