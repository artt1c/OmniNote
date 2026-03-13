import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { useMemo } from 'react'
import { getRandomUser } from '@/utils/userUtils'
import { Markdown } from 'tiptap-markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import { useYjs } from './useYjs';

const lowlight = createLowlight(common);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

export const useCollaborativeEditor = (documentName: string) => {
  const user = useMemo(() => getRandomUser(), [])
  const { ydoc, provider, isOnline, isLocalSynced } = useYjs(documentName, user)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
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
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  }, [ydoc, provider])
  return { editor, isOnline, user, isLocalSynced }
}