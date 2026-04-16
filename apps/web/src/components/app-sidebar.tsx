'use client';

import * as React from 'react';
import { Plus, Home, FileText, Settings, LogIn, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useNotes } from '@/hooks/useNotes';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useAuth } from '@/hooks/useAuth';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Trash2 } from 'lucide-react';

const navItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { notes, isLoading: isNotesLoading } = useNotes();
  const { createNewDocument, handleDeleteNote } = useWorkspace();
  const { isAuthenticated } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-foreground">
                <FileText className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-primary">OmniNote</span>
                <span className="truncate text-xs text-muted-foreground">
                  {isAuthenticated ? 'Synced' : 'Guest mode'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center px-4 mb-2 h-auto py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Actions</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={createNewDocument}
                  className="bg-primary hover:opacity-90 text-foreground"
                  tooltip="Create New Note"
                >
                  <Plus className="size-4" />
                  <span>New Note</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Unified Notes list — IndexedDB-first, merged with server when authenticated */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-4 mb-2 h-auto py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="size-3" />
            <span>Notes</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {isNotesLoading ? (
              <div className="px-4 py-2 text-xs text-muted-foreground">Loading notes...</div>
            ) : (
              <SidebarMenu>
                {notes.map((note) => (
                  <SidebarMenuItem key={note.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <SidebarMenuButton
                          onClick={() => router.push(`/documents/${note.id}`)}
                          tooltip={note.title}
                        >
                          <FileText className="size-4" />
                          <span className="truncate font-medium text-xs">
                            {note.title || 'Untitled'}
                          </span>
                        </SidebarMenuButton>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          <span>Delete note</span>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </SidebarMenuItem>
                ))}
                {notes.length === 0 && (
                  <div className="px-4 py-2 text-xs text-muted-foreground italic">
                    No notes yet
                  </div>
                )}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
