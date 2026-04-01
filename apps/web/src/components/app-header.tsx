import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 bg-background">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2 overflow-hidden px-4">

      </div>
    </header>
  );
}
