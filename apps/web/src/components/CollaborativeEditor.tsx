'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { useEffect, useState } from 'react'
import { WS_PORT } from '@omninote/shared'

export default function CollaborativeEditor() {
  const [status, setStatus] = useState('connecting...')
  const [ydoc] = useState(() => new Y.Doc())

  useEffect(() => {
    const provider = new HocuspocusProvider({
      url: `ws://localhost:${WS_PORT}`,
      name: 'my-document',
      document: ydoc,
    })

    provider.on('status', (event: { status: string }) => {
      setStatus(event.status)
    })

    return () => {
      provider.destroy()
    }
  }, [ydoc])

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        // history: false
      }),
      Collaboration.configure({ document: ydoc }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 border rounded-md shadow-sm',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 bg-gray-100 p-2 rounded w-fit">
        <span className={`inline-block w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 'bg-red-500'
        }`}></span>
        Status: <span className="font-medium">{status}</span>
      </div>
      <div className="bg-white">
        <EditorContent className="text-black" editor={editor} />
      </div>
    </div>
  )
}