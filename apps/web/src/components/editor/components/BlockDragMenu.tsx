import { GripVertical, Palette, ChevronRight, Repeat, Type, Copy, Link, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '../../ui/dropdown-menu';
import { TEXT_COLORS, BACKGROUND_COLORS } from '../constants';

interface BlockDragMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentNodeType: string;
  onAddBlock: (type: string, options?: any) => void;
  onDuplicate: () => void;
  onCopyClipboard: () => void;
  onCopyLink: () => void;
  onSetTextColor: (color: string) => void;
  onSetBackgroundColor: (color: string) => void;
}

export function BlockDragMenu({
  open,
  onOpenChange,
  currentNodeType,
  onAddBlock,
  onDuplicate,
  onCopyClipboard,
  onCopyLink,
  onSetTextColor,
  onSetBackgroundColor
}: BlockDragMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <div className="p-1 px-[1px] cursor-grab active:cursor-grabbing hover:bg-accent rounded-sm text-muted-foreground hover:text-foreground transition-colors group/drag">
          <GripVertical className="w-4 h-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 p-2 shadow-2xl border-border bg-[#121212] text-[#f4f4f4] rounded-xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
        <div className="text-[11px] font-bold text-[#888888] px-3 py-2 mb-1 uppercase tracking-widest leading-none">{currentNodeType}</div>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item outline-none data-[state=open]:bg-[#2c2c2c]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center text-[#888888] group-hover/item:text-white">
                <Palette className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium leading-none">Color</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#888888]" />
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-64 p-0 shadow-2xl border-border bg-[#121212] text-[#f4f4f4] rounded-xl overflow-hidden ml-1 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="text-[11px] font-bold text-[#888888] px-3 py-2.5 border-b border-[#2c2c2c] uppercase tracking-widest leading-none">Text color</div>
              <div className="p-1">
                {TEXT_COLORS.map((item) => (
                  <DropdownMenuItem key={item.label} onClick={() => onSetTextColor(item.name === 'default' ? 'default' : item.color)} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] rounded-lg mx-1 transition-colors outline-none">
                    <div className="w-6 h-6 flex items-center justify-center font-bold text-lg bg-[#1a1a1a] rounded border border-border/50" style={{ color: item.color }}>A</div>
                    <span className="text-[13px] leading-none">{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </div>

              <div className="text-[11px] font-bold text-[#888888] px-3 py-2.5 border-b border-t border-[#2c2c2c] uppercase tracking-widest leading-none">Background color</div>
              <div className="p-1 mb-1">
                {BACKGROUND_COLORS.map((item) => (
                  <DropdownMenuItem key={item.label} onClick={() => onSetBackgroundColor(item.color)} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] rounded-lg mx-1 transition-colors outline-none">
                    <div
                      className="w-6 h-6 rounded border border-border/50"
                      style={{
                        backgroundColor: item.color,
                        border: 'border' in item && item.border ? `1px solid ${item.border}` : 'none'
                      }}
                    />
                    <span className="text-[13px]">{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-0.5 transition-colors group/item data-[state=open]:bg-[#2c2c2c] outline-none">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center text-[#888888] group-hover/item:text-white">
                <Repeat className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium leading-none">Turn Into</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-64 p-2 shadow-2xl border-border bg-[#121212] text-[#f4f4f4] rounded-xl overflow-hidden ml-1">
              <DropdownMenuItem onClick={() => onAddBlock('paragraph')} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] rounded-lg mx-1 outline-none transition-colors group/sub-item">
                <Type className="w-4 h-4 text-[#9333ea] group-hover/sub-item:text-[#a855f7]" />
                <span className="text-[13px] font-medium leading-none">Text</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddBlock('heading', { level: 1 })} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] rounded-lg mx-1 outline-none transition-colors group/sub-item">
                <span className="text-[10px] font-bold text-[#888888] w-4 text-center group-hover/sub-item:text-white leading-none">H1</span>
                <span className="text-[13px] font-medium leading-none">Heading 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddBlock('heading', { level: 2 })} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] rounded-lg mx-1 outline-none transition-colors group/sub-item">
                <span className="text-[10px] font-bold text-[#888888] w-4 text-center group-hover/sub-item:text-white leading-none">H2</span>
                <span className="text-[13px] font-medium leading-none">Heading 2</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="my-1.5 bg-[#2c2c2c] mx-2" />

        <DropdownMenuItem onClick={onDuplicate} className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-1 transition-colors group/item outline-none">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center text-[#888888] group-hover/item:text-white">
              <Copy className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium leading-none">Duplicate</span>
          </div>
          <div className="text-[10px] text-[#555555] font-mono border border-[#333333] px-1.5 py-0.5 rounded bg-[#1a1a1a] leading-none">⌘D</div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onCopyClipboard} className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-1 transition-colors group/item outline-none">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center text-[#888888] group-hover/item:text-white">
              <Copy className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium leading-none">Copy to clipboard</span>
          </div>
          <div className="text-[10px] text-[#555555] font-mono border border-[#333333] px-1.5 py-0.5 rounded bg-[#1a1a1a] leading-none">⌘C</div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onCopyLink} className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer hover:bg-[#2c2c2c] focus:bg-[#2c2c2c] rounded-lg mx-1 transition-colors group/item outline-none">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center text-[#888888] group-hover/item:text-white">
              <Link className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium leading-none">Copy anchor link</span>
          </div>
          <div className="text-[10px] text-[#555555] font-mono border border-[#333333] px-1.5 py-0.5 rounded bg-[#1a1a1a] leading-none">⌘^L</div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-[#2c2c2c] mx-2" />

        <DropdownMenuItem onClick={() => onAddBlock('delete', null)} className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer hover:bg-destructive/10 text-destructive rounded-lg mx-1 transition-colors group/item outline-none">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium leading-none">Delete block</span>
          </div>
          <div className="text-[10px] opacity-70 font-mono border border-destructive/20 px-1.5 py-0.5 rounded bg-destructive/5 leading-none">Del</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
