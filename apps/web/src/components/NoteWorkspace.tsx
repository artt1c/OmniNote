'use client';

import { useEffect, memo } from 'react';
import { useDocumentHeader } from '@/hooks/useDocumentHeader';
import { useCollaborativeEditor } from '@/hooks/useCollaborativeEditor';
import { DocumentHeader } from './DocumentHeader';
import { CollaborativeEditor } from './CollaborativeEditor';
import { useCollaborators } from '@/context/CollaboratorsContext';

interface NoteWorkspaceProps {
  documentId: string;
}

const MemoizedCollaborativeEditor = memo(CollaborativeEditor);

export function NoteWorkspace({ documentId }: NoteWorkspaceProps) {
  const { editor, isOnline, isLocalSynced, ydoc, provider } = useCollaborativeEditor(documentId);
  const { title, relativeTime, onTitleChange } = useDocumentHeader(documentId, ydoc);
  const { setCollaborators } = useCollaborators();

  useEffect(() => {
    if (!editor || !ydoc || !isLocalSynced) return;

    const fragment = ydoc.getXmlFragment('default');
    const titleMap = ydoc.getMap('metadata');

    const pendingContent = sessionStorage.getItem(`pending_note_content_${documentId}`);
    const pendingTitle = sessionStorage.getItem(`pending_note_title_${documentId}`);

    // Set initial content if the document is empty
    if (fragment.length === 0 && pendingContent) {
      editor.commands.setContent(pendingContent);
      sessionStorage.removeItem(`pending_note_content_${documentId}`);
    }

    // Set initial title if none is set
    const currentTitle = titleMap.get('title') as string | undefined;
    if ((!currentTitle || currentTitle === 'Untitled' || currentTitle === '') && pendingTitle) {
      onTitleChange(pendingTitle);
      sessionStorage.removeItem(`pending_note_title_${documentId}`);
    }
  }, [editor, ydoc, isLocalSynced, documentId, onTitleChange]);

  useEffect(() => {
    const awareness = provider?.awareness;
    if (!awareness) {
      setCollaborators([]);
      return;
    }

    const updateCollaborators = () => {
      const states = awareness.getStates();
      const list: any[] = [];
      states.forEach((state: any, clientId: number) => {
        if (clientId !== awareness.clientID && state.user) {
          list.push({
            name: state.user.name,
            color: state.user.color,
            avatarUrl: state.user.avatarUrl,
            clientId,
          });
        }
      });
      setCollaborators(list);
    };

    updateCollaborators();
    awareness.on('change', updateCollaborators);

    return () => {
      awareness.off('change', updateCollaborators);
      setCollaborators([]);
    };
  }, [provider, setCollaborators]);

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
        <MemoizedCollaborativeEditor editor={editor} noteId={documentId} />
      </div>
    </div>
  );
}
