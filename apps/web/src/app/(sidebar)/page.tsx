'use client';

import { useRouter } from 'next/navigation';
import { useDocumentsHistory } from '@/hooks/useDocumentsHistory';
import { useWorkspace } from '@/hooks/useWorkspace';

export default function Home() {
  const router = useRouter();
  const { documents } = useDocumentsHistory();
  const { createNewDocument } = useWorkspace();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="text-center space-y-6 w-full max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">OmniNote</h1>
        <p className="text-secondary">Real-time collaborative editing.</p>

        <button
          onClick={createNewDocument}
          className="w-full rounded-md bg-primary px-3.5 py-3 text-sm font-semibold text-foreground shadow-sm hover:opacity-90 transition-all"
        >
          + Create new note
        </button>

        {documents.length > 0 && (
          <div className="mt-10 text-left">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Recent documents
            </h2>
            <div className="bg-card rounded-lg border border-border divide-y divide-border">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => router.push(`/documents/${doc.id}`)}
                  className="p-4 hover:bg-accent cursor-pointer transition-colors flex justify-between items-center group"
                >
                  <span className="font-medium text-sm text-foreground truncate w-48">
                    {doc.title}
                  </span>
                  <span className="text-xs text-secondary group-hover:text-primary">
                    Open →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}