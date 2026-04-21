import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';

export interface Collaborator {
  userId: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  permission: string;
  isOwner?: boolean;
}

export interface SearchResult {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
}

export function useShare(noteId: string, isOpen: boolean) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [collabs, publicStatus] = await Promise.all([
        fetchApi<Collaborator[]>(`/notes/${noteId}/collaborators`),
        fetchApi<{ isPublic: boolean }>(`/notes/${noteId}/public`)
      ]);
      setCollaborators(collabs);
      setIsPublic(publicStatus.isPublic);
    } catch (err) {
      console.error('Failed to fetch sharing data:', err);
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        const results = await fetchApi<SearchResult[]>(`/notes/search?q=${searchQuery}`);
        const filtered = results.filter(r => !collaborators.some(c => c.userId === r.id));
        setSearchResults(filtered);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, collaborators]);

  const handleShare = async (userId: string) => {
    try {
      await fetchApi(`/notes/${noteId}/collaborators`, {
        method: 'POST',
        body: JSON.stringify({ userId, permission: 'write' })
      });
      setSearchQuery('');
      setSearchResults([]);
      fetchData();
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await fetchApi(`/notes/${noteId}/collaborators/${userId}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch (err) {
      console.error('Failed to remove collaborator:', err);
    }
  };

  const togglePublic = async () => {
    try {
      const newStatus = !isPublic;
      await fetchApi(`/notes/${noteId}/public`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublic: newStatus })
      });
      setIsPublic(newStatus);
    } catch (err) {
      console.error('Failed to toggle public access:', err);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/note/${noteId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
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
  };
}
