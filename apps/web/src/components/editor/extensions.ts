import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import { User } from '@omninote/shared'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'

const lowlight = createLowlight(common);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

export const getEditorExtensions = (ydoc: Y.Doc, provider: HocuspocusProvider | null, user: User) => {
  return [
    StarterKit.configure({
      codeBlock: false,
      undoRedo: false,
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
    Markdown.configure({
      html: false,
      transformPastedText: true,
      transformCopiedText: true,
    }),
    Highlight.configure({
      HTMLAttributes: {
        class: 'bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/10 tiptap-highlight',
      },
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'tiptap-task-list',
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: 'tiptap-task-item',
      },
    }),
    Placeholder.configure({
      placeholder: "Type '/' for commands",
    }),
    Collaboration.configure({
      document: ydoc,
    }),
    ...(provider ? [
      CollaborationCaret.configure({
        provider: provider,
        user: user,
      })
    ] : []),
  ];
};
