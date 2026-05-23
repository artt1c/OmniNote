'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { 
  Plus, 
  FileText, 
  Search, 
  Sparkles, 
  Upload, 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  Trash2, 
  Link, 
  Check, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  FolderOpen,
  ArrowRight,
  User,
  ExternalLink
} from 'lucide-react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useNotes } from '@/hooks/useNotes';
import { useUser } from '@/hooks/useUser';
import { putLocalNote } from '@/lib/indexeddb-notes';

// Predefined templates
const TEMPLATES = [
  {
    id: 'meeting',
    title: 'Meeting Notes',
    description: 'Structure agenda, attendees, and action items',
    icon: Calendar,
    defaultTitle: '👥 Meeting Notes - ' + new Date().toLocaleDateString(),
    content: `# 👥 Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 

## Agenda
- [ ] Topic 1
- [ ] Topic 2

## Discussion & Notes
- Key takeaway from discussion
- Another key detail

## Action Items
- [ ] @assignee - Action item description
- [ ] @assignee - Action item description
`,
    color: 'border-primary/20 hover:border-primary/50 text-primary bg-primary/5'
  },
  {
    id: 'todo',
    title: 'Project Todo List',
    description: 'Keep track of daily goals, roadmap, and tasks',
    icon: CheckSquare,
    defaultTitle: '📝 Project Checklist',
    content: `# 📝 Project Checklist

## 🚀 High Priority
- [ ] Crucial task 1
- [ ] Crucial task 2

## 📅 Scheduled Tasks
- [ ] Scheduled task 1
- [ ] Scheduled task 2

## 💡 Backlog
- [ ] Brainstorming idea 1
- [ ] Brainstorming idea 2
`,
    color: 'border-secondary/20 hover:border-secondary/50 text-secondary bg-secondary/5'
  },
  {
    id: 'journal',
    title: 'Daily Journal',
    description: 'Reflect on your day, achievements, and lessons',
    icon: BookOpen,
    defaultTitle: '📖 Journal - ' + new Date().toLocaleDateString(),
    content: `# 📖 Daily Journal: ${new Date().toLocaleDateString()}

**Overall Mood:** ⭐️⭐️⭐️⭐️⭐️

## 💭 Reflections
What is on my mind today?

## 🏆 Daily Achievements
- Achievement 1
- Achievement 2

## 🎯 Focus for Tomorrow
- Tomorrow's focus item
`,
    color: 'border-earth-brown/20 hover:border-earth-brown/50 text-earth-brown bg-earth-brown/5'
  }
];

export default function Home() {
  const router = useRouter();
  const { createNewDocument, handleDeleteNote } = useWorkspace();
  const { notes, isLoading: isNotesLoading, refetch: syncNotes } = useNotes();
  const { user, isAuthenticated } = useUser();

  // Greeting based on time of day
  const [greeting, setGreeting] = useState('Welcome');
  const [greetingIcon, setGreetingIcon] = useState('👋');

  // Interactive Scratchpad state
  const [scratchpadTitle, setScratchpadTitle] = useState('');
  const [scratchpadContent, setScratchpadContent] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Network status state
  const [isOnline, setIsOnline] = useState(true);

  // Link copied state for animation
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  useEffect(() => {
    // Update network status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  useEffect(() => {
    // Dynamic greeting calculation
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
      setGreetingIcon('🌅');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good afternoon');
      setGreetingIcon('☀️');
    } else if (hour >= 18 && hour < 23) {
      setGreeting('Good evening');
      setGreetingIcon('🌙');
    } else {
      setGreeting('Working late?');
      setGreetingIcon('🦉');
    }
  }, []);

  // Helper to create a note with prefilled content
  const createNoteWithContent = async (title: string, content: string) => {
    const id = uuidv4();
    sessionStorage.setItem(`pending_note_title_${id}`, title || 'Untitled');
    sessionStorage.setItem(`pending_note_content_${id}`, content || '');
    
    // Write metadata locally so it's tracked in IndexedDB
    await putLocalNote({ 
      id, 
      title: title || 'Untitled', 
      updatedAt: new Date().toISOString(), 
      syncState: 'synced' 
    });
    
    router.push(`/documents/${id}`);
  };

  // Import file handler
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const title = file.name.replace(/\.(md|txt)$/i, '') || 'Imported Note';
      await createNoteWithContent(title, content);
    };
    reader.readAsText(file);
  };

  // Convert scratchpad contents to a note
  const handleConvertScratchpad = async () => {
    if (!scratchpadContent.trim()) return;
    const title = scratchpadTitle.trim() || 'Scratchpad Note';
    await createNoteWithContent(title, scratchpadContent);
    // Clear scratchpad
    setScratchpadTitle('');
    setScratchpadContent('');
  };

  // Copy document link to clipboard
  const handleCopyLink = (noteId: string) => {
    const link = `${window.location.origin}/documents/${noteId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedNoteId(noteId);
      setTimeout(() => setCopiedNoteId(null), 2000);
    });
  };

  // Scratchpad word and character count
  const charCount = scratchpadContent.length;
  const wordCount = scratchpadContent.trim() === '' ? 0 : scratchpadContent.trim().split(/\s+/).length;

  // Filter notes
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-[#0f120f] to-background p-6 md:p-8">
      {/* Upper Layout Grid */}
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Welcome Banner Card */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 md:p-8 backdrop-blur-xl shadow-xl shadow-primary/5 transition-all">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute left-1/3 bottom-0 -mb-20 h-40 w-40 rounded-full bg-secondary/10 blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl">{greetingIcon}</span>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                  {greeting}
                </h1>
              </div>
              <p className="mt-2 text-muted-foreground max-w-xl">
                Welcome to your OmniNote collaborative workspace.
                Edit together with your team in real-time and structure ideas offline.
              </p>
              
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground border border-border">
                  <User className="h-3 w-3 text-primary" />
                  {isAuthenticated ? (
                    <span>{user?.username || user?.email || 'Authenticated'}</span>
                  ) : (
                    <span>Guest Mode</span>
                  )}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
                  isOnline 
                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-950/30 text-amber-400 border-amber-500/20'
                }`}>
                  {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <button
              onClick={createNewDocument}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-foreground shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all duration-200"
            >
              <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
              Create Note
            </button>
          </div>
        </section>

        {/* Dashboard Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Scratchpad & Templates */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Quick Scratchpad Card */}
            <section className="rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md shadow-md hover:border-primary/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <h2 className="text-lg font-bold text-foreground">Quick Scratchpad</h2>
                </div>
                <div className="text-xs text-muted-foreground flex gap-3">
                  <span>Words: {wordCount}</span>
                  <span>Characters: {charCount}</span>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note Title (optional)..."
                  value={scratchpadTitle}
                  onChange={(e) => setScratchpadTitle(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                
                <textarea
                  placeholder="Type your thoughts here and instantly convert them to a note..."
                  value={scratchpadContent}
                  onChange={(e) => setScratchpadContent(e.target.value)}
                  rows={5}
                  className="w-full bg-background/50 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none font-sans"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleConvertScratchpad}
                    disabled={!scratchpadContent.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent border border-border hover:border-primary/30 px-4 py-2 text-xs font-semibold text-foreground disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <span>Convert to Note</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </section>

            {/* Note Templates Card */}
            <section className="rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md shadow-md">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                <span>Templates</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TEMPLATES.map((tpl) => {
                  const IconComponent = tpl.icon;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => createNoteWithContent(tpl.defaultTitle, tpl.content)}
                      className={`flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer ${tpl.color}`}
                    >
                      <div className="rounded-lg p-2 bg-background/80 border border-border mb-3">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mb-1">{tpl.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tpl.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Recent Notes & File Importer */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Recent Notes List with Search */}
            <section className="rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md shadow-md flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <span>Recent Notes</span>
                </h2>
                <span className="text-xs bg-accent px-2 py-0.5 border border-border rounded-full text-foreground">
                  {notes.length}
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Notes List Scrollable Area */}
              <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2.5 pr-1">
                {isNotesLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl border border-border bg-background/25 animate-pulse"></div>
                  ))
                ) : filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <div 
                      key={note.id}
                      className="group flex items-center justify-between p-3 rounded-xl border border-border bg-background/20 hover:bg-background/40 hover:border-primary/10 transition-all duration-200"
                    >
                      <button
                        onClick={() => router.push(`/documents/${note.id}`)}
                        className="flex-1 text-left flex items-start gap-2.5 min-w-0"
                      >
                        <FileText className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {note.title || 'Untitled'}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(note.updatedAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyLink(note.id)}
                          title="Copy note link"
                          className="p-1.5 rounded-lg hover:bg-accent text-foreground transition-colors"
                        >
                          {copiedNoteId === note.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Link className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          title="Delete note"
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground opacity-30 mb-2" />
                    <p className="text-xs text-muted-foreground">No notes found</p>
                  </div>
                )}
              </div>
            </section>

            {/* Markdown Importer Card */}
            <section className="rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md shadow-md hover:border-secondary/10 transition-colors">
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Upload className="h-5 w-5 text-earth-brown" />
                <span>Import Document</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Upload a text or Markdown file (.md, .txt) to open it instantly.
              </p>

              <label className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-6 hover:bg-background/20 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-200 mb-2" />
                <span className="text-xs font-semibold text-foreground">Choose File</span>
                <span className="text-[10px] text-muted-foreground mt-1">supports .md, .txt</span>
                <input
                  type="file"
                  accept=".md,.txt"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </section>

          </div>

        </div>

      </div>
    </main>
  );
}