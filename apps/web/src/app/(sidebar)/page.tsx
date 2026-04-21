'use client';

import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/hooks/useWorkspace';

export default function Home() {
  const router = useRouter();
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

      </div>
    </main>
  );
}