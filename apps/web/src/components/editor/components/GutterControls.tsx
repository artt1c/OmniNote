import { useState } from 'react';
import { Editor } from '@tiptap/react';
import { DragHandle } from '@tiptap/extension-drag-handle-react';
import { BlockPlusMenu } from './BlockPlusMenu';
import { BlockDragMenu } from './BlockDragMenu';
import { useEditorLogic } from '../use-editor-logic';

interface GutterControlsProps {
  editor: Editor | null;
  noteId?: string;
}

export function GutterControls({ editor, noteId }: GutterControlsProps) {
  const [plusMenuOpened, setPlusMenuOpened] = useState(false);
  const [dragMenuOpened, setDragMenuOpened] = useState(false);
  const [currentNodeType, setCurrentNodeType] = useState<string>('Text');

  const {
    addBlock,
    duplicateNode,
    copyNodeLink,
    copyToClipboard,
    setTextColor,
    setBackgroundColor
  } = useEditorLogic(editor);

  if (!editor) return null;

  return (
    <DragHandle
      key={`${noteId}-drag-handle`}
      editor={editor}
      onNodeChange={({ node }) => {
        if (node) {
          const name = node.type.name;
          setCurrentNodeType(name === 'paragraph' ? 'Text' : name.charAt(0).toUpperCase() + name.slice(1));
        }
      }}
      className="flex items-center justify-end w-12 md:w-16 pr-2 z-50 group/handle"
    >
      <div
        className={`flex items-center bg-background/90 backdrop-blur-md rounded-md shadow-sm border border-border p-0.5 shadow-md transition-opacity duration-200 ${plusMenuOpened || dragMenuOpened ? 'opacity-100' : 'opacity-0 group-hover/root:opacity-100'}`}
      >
        <BlockPlusMenu
          open={plusMenuOpened}
          onOpenChange={(open) => {
            setPlusMenuOpened(open);
            if (open) setDragMenuOpened(false);
          }}
          onAddBlock={addBlock}
        />

        <BlockDragMenu
          open={dragMenuOpened}
          onOpenChange={(open) => {
            setDragMenuOpened(open);
            if (open) setPlusMenuOpened(false);
          }}
          currentNodeType={currentNodeType}
          onAddBlock={addBlock}
          onDuplicate={duplicateNode}
          onCopyClipboard={copyToClipboard}
          onCopyLink={() => copyNodeLink(noteId)}
          onSetTextColor={setTextColor}
          onSetBackgroundColor={setBackgroundColor}
        />
      </div>
    </DragHandle>
  );
}
