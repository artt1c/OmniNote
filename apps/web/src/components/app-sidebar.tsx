'use client';

import * as React from 'react';
import { Plus, Home, FileText, Settings, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

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
import { useDocumentsHistory } from '@/hooks/useDocumentsHistory';
import { useNotes } from '@/hooks/useNotes';
import { useWorkspace } from '@/hooks/useWorkspace';
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
  const { documents: recentDocuments } = useDocumentsHistory();
  const { notes, isLoading: isNotesLoading } = useNotes();
  const { createNewDocument, handleDeleteNote } = useWorkspace();

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
                <span className="truncate text-xs text-muted-foreground">Editor</span>
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

        {/* Recent Documents (Local) */}
        {recentDocuments.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 px-4 mb-2 h-auto py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="size-3" />
              <span>Recent Documents</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentDocuments.map((doc) => (
                  <SidebarMenuItem key={`recent-${doc.id}`}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <SidebarMenuButton
                          onClick={() => router.push(`/documents/${doc.id}`)}
                          tooltip={doc.title}
                        >
                          <Clock className="size-4" />
                          <span className="truncate font-medium text-xs">{doc.title}</span>
                        </SidebarMenuButton>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem 
                          onClick={() => handleDeleteNote(doc.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          <span>Delete note</span>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* All Notes (Cloud) */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-4 mb-2 h-auto py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="size-3" />
            <span>All Notes</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {isNotesLoading ? (
              <div className="px-4 py-2 text-xs text-muted-foreground">Loading notes...</div>
            ) : (
              <SidebarMenu>
                {notes.map((note) => (
                  <SidebarMenuItem key={`cloud-${note.id}`}>
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
                    No notes found in cloud
                  </div>
                )}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
