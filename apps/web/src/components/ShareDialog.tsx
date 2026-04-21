'use client';

import React from 'react';
import {
  X,
  Share2,
  Copy,
  UserPlus,
  Loader2,
  Globe,
  Check,
  Trash2,
  Shield,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useShare, type Collaborator, type SearchResult } from '@/hooks/useShare';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  noteTitle: string;
}

export function ShareDialog({ isOpen, onClose, noteId, noteTitle }: ShareDialogProps) {
  const { user: currentUser } = useUser();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    collaborators,
    isPublic,
    loading,
    searching,
    copied,
    handleShare,
    handleRemove,
    togglePublic,
    copyLink
  } = useShare(noteId, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Share "{noteTitle}"</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-secondary">Share with people</h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <Input
                placeholder="Add username..."
                className="pl-10 h-11 bg-secondary/5 border-secondary/20 focus:border-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searching && (
                <div className="absolute right-3 inset-y-0 flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 z-10 w-full bg-popover border border-border rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto p-1 overflow-x-hidden">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleShare(user.id)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-secondary/20 rounded-lg transition-colors text-left"
                    >
                      <Avatar size="sm">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.username}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                      <UserPlus className="w-4 h-4 ml-auto text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-secondary">People with access</h3>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                </div>
              ) : (
                collaborators.map((collab) => (
                  <div key={collab.userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar size="default">
                        <AvatarImage src={collab.avatarUrl} />
                        <AvatarFallback>{collab.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{collab.username}</span>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">{collab.email}</span>
                          <span className="text-xs font-semibold text-primary/70">{collab.isOwner ? 'Owner' : 'Collaborator'}</span>
                        </div>
                      </div>
                    </div>
                    {!collab.isOwner && currentUser?.id !== collab.userId && (
                      <button
                        onClick={() => handleRemove(collab.userId)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isPublic ? "bg-green-500/10" : "bg-secondary/10"
              )}>
                <Globe className={cn("w-5 h-5", isPublic ? "text-green-500" : "text-secondary")} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Public link access</span>
                <span className="text-xs text-secondary">Anyone with the link can view</span>
              </div>
            </div>
            <button
              onClick={togglePublic}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                isPublic ? "bg-primary" : "bg-secondary"
              )}
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                isPublic ? "left-6" : "left-1"
              )} />
            </button>
          </div>
        </div>

        <div className="p-6 bg-secondary/10 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <Shield className="w-3.5 h-3.5" />
            Only people with access can edit
          </div>
          <Button
            className="rounded-xl gap-2 font-semibold"
            onClick={copyLink}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </div>
    </div>
  );
}
