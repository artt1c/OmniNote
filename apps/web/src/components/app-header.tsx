'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { removeAuthCookie } from '@/lib/auth-cookie';
import { clearAllOfflineData } from '@/lib/indexeddb-notes';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DocumentSyncIndicator } from './DocumentSyncIndicator';
import { ShareDocumentButton } from './ShareDocumentButton';

export function AppHeader() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useUser();

  const handleLogout = async () => {
    removeAuthCookie();
    await clearAllOfflineData();
    router.push('/login');
  };

  const displayName = user?.username || user?.email || 'Add username';
  const avatarSeed = displayName;
  const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 overflow-hidden px-4">
          {/* Page title or breadcrumbs could go here */}
          <DocumentSyncIndicator />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2 empty:hidden">

          <ShareDocumentButton />
        </div>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
            </div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-1 pr-2 rounded-full transition-colors">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
                    {displayName}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 grayscale brightness-90">
                <Avatar className="h-8 w-8 ring-1 ring-border opacity-70">
                  <AvatarImage src={avatarUrl} alt="Guest" />
                  <AvatarFallback className="bg-muted">G</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                  Guest
                </span>
              </div>

              <Separator orientation="vertical" className="h-6 hidden sm:block" />

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/signup">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
