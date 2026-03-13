'use client';

import { EditorContent } from '@tiptap/react';
import { useCollaborativeEditor } from '@/hooks/useCollaborativeEditor';

interface Props {
  documentName: string;
}

export function CollaborativeEditor({ documentName }: Props) {
  const { editor, isOnline, user, isLocalSynced } = useCollaborativeEditor(documentName);

  if (!isLocalSynced) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading local data...</p>
        </div>
      </div>
    );
  }

  if (!editor) return null;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b px-4 py-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-400'}`} />
          {isOnline ? 'online' : 'offline'}
        </div>
        <div>User: {user.name}</div>
      </div>

      <EditorContent className="text-black prose" editor={editor} />
    </div>
  );
}

export default CollaborativeEditor;