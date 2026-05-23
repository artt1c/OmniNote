import { useEditor } from '@tiptap/react'
import { useMemo } from 'react'
import { getRandomUser } from '@/utils/userUtils'
import { useYjs } from './useYjs';
import { getEditorExtensions } from '@/components/editor/extensions';
import { useUser } from './useUser';

export const useCollaborativeEditor = (documentName: string) => {
  const { user: currentUser } = useUser()

  const user = useMemo(() => {
    if (currentUser) {
      const name = currentUser.username || currentUser.email || 'Anonymous';
      const colors = ['#6366f1', '#A06B3E', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const color = colors[Math.abs(hash) % colors.length];
      return {
        name,
        color,
        avatarUrl: currentUser.avatarUrl
      };
    }
    return getRandomUser();
  }, [currentUser])

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

  return { editor, isOnline, user, isLocalSynced, ydoc, provider }
}