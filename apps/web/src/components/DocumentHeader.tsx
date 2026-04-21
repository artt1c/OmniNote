import { useEffect } from 'react';
import { documentStateStore } from '@/store/document-state';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentHeaderProps {
  noteId: string;
  title: string;
  relativeTime: string;
  onTitleChange: (newTitle: string) => void;
  isOnline: boolean;
  isLocalSynced: boolean;
}

export function DocumentHeader({
  noteId,
  title,
  relativeTime,
  onTitleChange,
  isOnline,
  isLocalSynced
}: DocumentHeaderProps) {
  useEffect(() => {
    documentStateStore.setState({ noteId, title, isOnline, isLocalSynced });
    return () => {
      documentStateStore.setState({ noteId: null, title: '', isOnline: false, isLocalSynced: false });
    };
  }, [noteId, title, isOnline, isLocalSynced]);

  return (
    <div className="pt-12 pb-4 w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        {title || isLocalSynced ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-5xl font-bold tracking-tight text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground w-full focus:ring-0 p-0"
            placeholder="Document Title"
          />
        ) : (
          <Skeleton className="h-[60px] w-3/4 mb-2" />
        )}
        <div className="text-sm text-secondary">
          {isLocalSynced ? `Last edited ${relativeTime}` : <Skeleton className="h-4 w-32 inline-block" />}
        </div>
      </div>
    </div>
  );
}
