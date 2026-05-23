import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
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
    TextStyle,
    Color,
    Markdown.configure({
      html: false,
      transformPastedText: true,
      transformCopiedText: true,
    }),
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: 'rounded border border-primary/10 px-0.5',
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
        render: (user: any) => {
          const cursor = document.createElement('span');
          cursor.classList.add('collaboration-cursor');
          cursor.style.setProperty('--cursor-color', user.color);

          const caret = document.createElement('span');
          caret.classList.add('collaboration-cursor__caret');
          
          const label = document.createElement('span');
          label.classList.add('collaboration-cursor__label');
          label.textContent = user.name;

          cursor.appendChild(caret);
          cursor.appendChild(label);
          return cursor;
        },
        selectionRender: (user: any) => {
          return {
            class: 'collaboration-cursor__selection',
            style: `background-color: ${user.color}33`,
          };
        },
      })
    ] : []),
  ];
};
