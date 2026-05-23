import { Heading1, List, ListOrdered, CheckSquare, TextQuote, Code, Trash2, Type, Plus } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../ui/dropdown-menu';

interface BlockPlusMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (type: string, options?: any) => void;
}

export function BlockPlusMenu({ open, onOpenChange, onAddBlock }: BlockPlusMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 p-0 hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 p-2 shadow-2xl border-border bg-[#121212] text-[#f4f4f4] rounded-xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
        <div className="text-[11px] font-bold text-[#888888] px-3 py-2 mb-1 uppercase tracking-widest leading-none">Basic blocks</div>

        <DropdownMenuItem onClick={() => onAddBlock('paragraph')} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none">
          <div className="w-5 h-5 flex items-center justify-center text-[#9333ea] group-hover/item:text-[#a855f7]">
            <Type className="w-4 h-4" />
          </div>
          <span className="text-[13px] font-medium leading-none">Text</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAddBlock('heading', { level: 1 })} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none">
          <div className="w-5 h-5 flex items-center justify-center text-[#888888] font-bold text-[10px] group-hover/item:text-white">H1</div>
          <span className="text-[13px] font-medium leading-none">Heading 1</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAddBlock('heading', { level: 2 })} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none">
          <div className="w-5 h-5 flex items-center justify-center text-[#888888] font-bold text-[10px] group-hover/item:text-white">H2</div>
          <span className="text-[13px] font-medium leading-none">Heading 2</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAddBlock('heading', { level: 3 })} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none">
          <div className="w-5 h-5 flex items-center justify-center text-[#888888] font-bold text-[10px] group-hover/item:text-white">H3</div>
          <span className="text-[13px] font-medium leading-none">Heading 3</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAddBlock('bulletList')} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none">
          <div className="w-5 h-5 flex items-center justify-center text-[#888888] group-hover/item:text-white">
            <List className="w-4 h-4" />
          </div>
          <span className="text-[13px] font-medium leading-none">Bulleted list</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAddBlock('orderedList')} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none">
          <div className="w-5 h-5 flex items-center justify-center text-[#888888] group-hover/item:text-white">
            <ListOrdered className="w-4 h-4" />
          </div>
          <span className="text-[13px] font-medium leading-none">Numbered list</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAddBlock('taskList')} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none">
          <div className="w-5 h-5 flex items-center justify-center text-[#888888] group-hover/item:text-white">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="text-[13px] font-medium leading-none">To-do list</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAddBlock('blockquote')} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none">
          <div className="w-5 h-5 flex items-center justify-center text-[#9333ea] group-hover/item:text-[#a855f7]">
            <TextQuote className="w-4 h-4" />
          </div>
          <span className="text-[13px] font-medium leading-none">Blockquote</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAddBlock('codeBlock')} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none">
          <div className="w-5 h-5 flex items-center justify-center text-[#888888] group-hover/item:text-white">
            <Code className="w-4 h-4" />
          </div>
          <span className="text-[13px] font-medium leading-none">Code block</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
