import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CollaboratorsProvider } from '@/context/CollaboratorsContext';

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <CollaboratorsProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex flex-1 flex-col">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </CollaboratorsProvider>
    </TooltipProvider>
  );
}
