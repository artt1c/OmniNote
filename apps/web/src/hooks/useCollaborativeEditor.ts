import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { IndexeddbPersistence } from 'y-indexeddb'
import { useEffect, useState, useMemo } from 'react'
import { User, getRandomUser } from '@/utils/userUtils'
import { WS_PORT } from '@omninote/shared'
import { Markdown } from 'tiptap-markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';

const lowlight = createLowlight(common);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

export const useCollaborativeEditor = (documentName: string) => {
  const [status, setStatus] = useState('connecting...')
  const user = useMemo<User>(() => getRandomUser(), [])
  const ydoc = useMemo(() => new Y.Doc(), [])
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null)

  useEffect(() => {
    const wsProvider = new HocuspocusProvider({
      url: `ws://localhost:${WS_PORT}`,
      name: documentName,
      document: ydoc,
      onConnect: () => {
        wsProvider.setAwarenessField('user', user)
      }
    })

    const indexeddbProvider = new IndexeddbPersistence(documentName, ydoc)

    wsProvider.on('status', (event: { status: string }) => {
      setStatus(event.status)
    })

    setProvider(wsProvider)

    return () => {
      wsProvider.destroy()
      indexeddbProvider.destroy()
    }
  }, [ydoc, documentName])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // history: false,
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
        document: ydoc
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
  }, [provider])

  return { editor, status, user }
}