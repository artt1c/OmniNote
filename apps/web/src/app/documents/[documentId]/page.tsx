import { CollaborativeEditor } from '@/components/CollaborativeEditor';
import { HistoryTracker } from '@/components/HistoryTracker';

interface PageProps {
  params: Promise<{ documentId: string }>;
}

export default async function DocumentPage({ params }: PageProps) {
  const { documentId } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <HistoryTracker documentId={documentId} />

      <div className="w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-700">
            Документ: <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{documentId.slice(0, 8)}...</span>
          </h1>
          <a href="/" className="text-sm text-blue-600 hover:underline">← На головну</a>
        </div>

        <CollaborativeEditor documentName={documentId} />
      </div>
    </main>
  );
}