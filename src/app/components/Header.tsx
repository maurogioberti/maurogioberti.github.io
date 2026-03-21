import Link from 'next/link';

import { ThemeToggle } from './theme/ThemeToggle';
import { headerViewModel } from './headerViewModel';

export async function Header() {
  const { content, profile } = await headerViewModel();

  return (
    <header className="sticky top-0 z-50 glass text-vs-foreground w-full h-16">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="text-base sm:text-lg font-semibold tracking-tighter leading-tight">
          <Link href="/" className="hover:opacity-80">
            {profile?.fullname}
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ul className="flex items-center gap-2 text-sm whitespace-nowrap sm:gap-3 sm:text-base">
            {content.map((link: { href: string; label: string }) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:opacity-80">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
