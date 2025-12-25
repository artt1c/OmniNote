import CollaborativeEditor from "@/components/CollaborativeEditor";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center pt-10">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
        OmniNote
      </h1>
      <p className="text-gray-500 mb-8">
        Real-time Collaborative Editor (Local-First)
      </p>

      <div className="w-full">
        <CollaborativeEditor />
      </div>
    </main>
  );
}