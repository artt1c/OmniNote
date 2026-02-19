'use client';

import { EditorContent } from '@tiptap/react';
import { useCollaborativeEditor } from '@/hooks/useCollaborativeEditor';

interface Props {
  documentName: string;
}

export function CollaborativeEditor({ documentName }: Props) {
  const { editor, status, user } = useCollaborativeEditor(documentName);

  if (!editor) return null;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b px-4 py-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
          {status}
        </div>
        <div>User: {user.name}</div>
      </div>

      <EditorContent className="text-black" editor={editor} />
    </div>
  );
}

export default CollaborativeEditor;