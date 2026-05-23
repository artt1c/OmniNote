'use client';

import { EditorContent, Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Italic, Strikethrough } from 'lucide-react';
import { Button } from '../ui/button';
import { GutterControls } from './components/GutterControls';

interface CollaborativeEditorProps {
  editor: Editor | null;
  noteId?: string;
}

export function CollaborativeEditor({ editor, noteId }: CollaborativeEditorProps) {
  if (!editor) return null;

  return (
    <div className="w-full relative group/root">
      <GutterControls editor={editor} noteId={noteId} />

      <BubbleMenu editor={editor} className="flex overflow-hidden rounded-lg bg-card/95 backdrop-blur-xl border border-border shadow-2xl divide-x divide-border">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('bold') ? 'bg-accent text-foreground' : 'bg-transparent'}`}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('italic') ? 'bg-accent text-foreground' : 'bg-transparent'}`}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('strike') ? 'bg-accent text-foreground' : 'bg-transparent'}`}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
      </BubbleMenu>

      <div className="w-full">
        <EditorContent
          editor={editor}
          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
}

export default CollaborativeEditor;
