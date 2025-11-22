import Link from 'next/link';

import { headerViewModel } from './headerViewModel';

export async function Header() {
  const { content, profile } = await headerViewModel();

  return (
    <header className="bg-vs-background-secondary text-vs-foreground shadow-md w-full h-16">
      <nav className="max-w-7xl mx-auto pl-1 pr-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        <div className="text-base sm:text-lg font-semibold tracking-tighter leading-tight mr-2">
          <Link href="/" className="hover:opacity-80">
            {profile?.fullname}
          </Link>
        </div>
        <ul className="flex space-x-3 mr-2">
          {content.map((link: { href: string; label: string }) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:opacity-80">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}