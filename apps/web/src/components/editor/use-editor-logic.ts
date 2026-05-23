import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import '@tiptap/extension-color';
import '@tiptap/extension-text-style';

export function useEditorLogic(editor: Editor | null) {
  const addBlock = useCallback((type: string, options?: any) => {
    if (!editor || editor.isDestroyed) return;

    const chain = editor.chain().focus();

    if (type === 'heading') {
      chain.toggleHeading({ level: options.level }).run();
    } else if (type === 'bulletList') {
      chain.toggleBulletList().run();
    } else if (type === 'orderedList') {
      chain.toggleOrderedList().run();
    } else if (type === 'taskList') {
      chain.toggleTaskList().run();
    } else if (type === 'blockquote') {
      chain.toggleBlockquote().run();
    } else if (type === 'codeBlock') {
      chain.toggleCodeBlock().run();
    } else if (type === 'paragraph') {
      chain.setParagraph().run();
    } else if (type === 'delete') {
      const { selection } = editor.state;
      chain.deleteRange({ from: selection.$from.before(), to: selection.$from.after() }).run();
    }
  }, [editor]);

  const duplicateNode = useCallback(() => {
    if (!editor) return;
    const { selection } = editor.state;
    const content = selection.$from.node(selection.$from.depth).toJSON();
    editor.chain().focus().insertContentAt(selection.$from.after(), content).run();
  }, [editor]);

  const copyNodeLink = useCallback((noteId?: string) => {
    const url = `${window.location.origin}/notes/${noteId}#block-${Date.now()}`;
    navigator.clipboard.writeText(url);
  }, []);

  const copyToClipboard = useCallback(() => {
    if (!editor) return;
    const { selection } = editor.state;
    const text = selection.$from.node(selection.$from.depth).textContent;
    navigator.clipboard.writeText(text);
  }, [editor]);

  const setTextColor = useCallback((color: string) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (color === 'default') {
      chain.unsetColor().run();
    } else {
      chain.setColor(color).run();
    }
  }, [editor]);

  const setBackgroundColor = useCallback((color: string) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (color === 'transparent') {
      chain.unsetHighlight().run();
    } else {
      chain.setHighlight({ color }).run();
    }
  }, [editor]);

  return {
    addBlock,
    duplicateNode,
    copyNodeLink,
    copyToClipboard,
    setTextColor,
    setBackgroundColor,
  };
}
