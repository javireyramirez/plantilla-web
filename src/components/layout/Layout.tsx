import logo from '@/assets/logo.png';
import { Separator } from '@/components/ui/separator.js';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.js';

import NavUser from './NavUser.js';
import AppSidebar from './Sidebar.js';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center px-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" className="size-8 object-contain" />
              <span className="font-medium">Empresa Genérica</span>
            </div>
          </div>

          <div className="ml-auto items-center hidden md:block">
            <NavUser />
          </div>
        </header>

        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
