'use client';

import { EditorContent, Editor } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import {
  Bold, Italic, Strikethrough,
  Heading1, Heading2, Heading3,
  List, TextQuote
} from 'lucide-react';
import { Button } from './ui/button';

interface CollaborativeEditorProps {
  editor: Editor | null;
}

export function CollaborativeEditor({ editor }: CollaborativeEditorProps) {
  if (!editor) return null;

  return (
    <div className="w-full">
      <div className="overflow-hidden">
        <BubbleMenu editor={editor} className="flex overflow-hidden rounded-lg bg-card border border-border shadow-xl divide-x divide-border">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('bold') ? 'bg-accent text-foreground' : ''}`}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('italic') ? 'bg-accent text-foreground' : ''}`}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('strike') ? 'bg-accent text-foreground' : ''}`}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
        </BubbleMenu>

        <FloatingMenu editor={editor} className="flex gap-1 overflow-hidden rounded-lg bg-card border border-border shadow-xl p-1">
          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-accent text-foreground' : ''}`}
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-accent text-foreground' : ''}`}
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-accent text-foreground' : ''}`}
          >
            <Heading3 className="w-4 h-4" />
          </Button>
          <div className="w-px bg-border my-1 mx-0.5" />
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('bulletList') ? 'bg-accent text-foreground' : ''}`}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded text-foreground hover:bg-accent hover:text-foreground transition-colors ${editor.isActive('blockquote') ? 'bg-accent text-foreground' : ''}`}
          >
            <TextQuote className="w-4 h-4" />
          </Button>
        </FloatingMenu>

        <EditorContent className="relative" editor={editor} />
      </div>
    </div>
  );
}

export default CollaborativeEditor;