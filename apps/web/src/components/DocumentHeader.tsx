'use client';

interface DocumentHeaderProps {
  title: string;
  relativeTime: string;
  onTitleChange: (newTitle: string) => void;
}

export function DocumentHeader({ title, relativeTime, onTitleChange }: DocumentHeaderProps) {
  return (
    <div className="px-4 pt-12 pb-4 w-full">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-5xl font-bold tracking-tight text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground w-full focus:ring-0 p-0"
        placeholder="Document Title"
      />
      <p className="text-sm text-secondary mt-4">
        Last edited {relativeTime}
      </p>
    </div>
  );
}
