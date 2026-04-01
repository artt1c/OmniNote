import { NoteWorkspace } from '@/components/NoteWorkspace';
import { HistoryTracker } from '@/components/HistoryTracker';

interface PageProps {
  params: Promise<{ documentId: string }>;
}

export default async function DocumentPage({ params }: PageProps) {
  const { documentId } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-background">
      <HistoryTracker documentId={documentId} />
      <NoteWorkspace documentId={documentId} />
    </main>
  );
}