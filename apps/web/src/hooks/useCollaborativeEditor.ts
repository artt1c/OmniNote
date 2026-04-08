import { useEditor } from '@tiptap/react'
import { useMemo } from 'react'
import { getRandomUser } from '@/utils/userUtils'
import { useYjs } from './useYjs';
import { getEditorExtensions } from '@/components/editor/extensions';

export const useCollaborativeEditor = (documentName: string) => {
  const user = useMemo(() => getRandomUser(), [])
  const { ydoc, provider, isOnline, isLocalSynced } = useYjs(documentName, user)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getEditorExtensions(ydoc, provider, user),
    editorProps: {
      attributes: {
        class: 'prose prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground max-w-none focus:outline-none min-h-[300px] text-foreground tiptap-zen',
      },
    },
  }, [ydoc, provider])
  return { editor, isOnline, user, isLocalSynced, ydoc }
}