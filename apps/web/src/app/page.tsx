'use client';

import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useDocumentsHistory } from '@/hooks/useDocumentsHistory';

export default function Home() {
  const router = useRouter();
  const { documents } = useDocumentsHistory();

  const createNewDocument = () => {
    const id = uuidv4();
    router.push(`/documents/${id}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <div className="text-center space-y-6 w-full max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">OmniNote</h1>
        <p className="text-gray-600">Спільне редагування в реальному часі.</p>

        <button
          onClick={createNewDocument}
          className="w-full rounded-md bg-indigo-600 px-3.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
        >
          + Створити нову нотатку
        </button>

        {documents.length > 0 && (
          <div className="mt-10 text-left">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Останні документи
            </h2>
            <div className="bg-gray-50 rounded-lg border divide-y">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => router.push(`/documents/${doc.id}`)}
                  className="p-4 hover:bg-gray-100 cursor-pointer transition-colors flex justify-between items-center group"
                >
                  <span className="font-mono text-sm text-gray-700 truncate w-48">
                    {doc.id}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-indigo-500">
                    Відкрити →
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