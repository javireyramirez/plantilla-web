import { Outlet } from 'react-router-dom';

import logo from '@/assets/logo.png';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { ModeToggle } from '@/components/theme/mode-toggle';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex h-14 items-center justify-between px-6 border-b">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="size-8 object-contain" />
          <span className="font-medium">Empresa Genérica</span>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <LanguageSwitcher />
        </div>
      </header>
      <main>
        {' '}
        <Outlet />{' '}
      </main>
    </div>
  );
}
