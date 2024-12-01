import Link from "next/link";
import { headerViewModel } from "./headerViewModel";

export async function Header() {
  const { content, profile } = await headerViewModel();

  return (
    <header className="bg-vs-background-light text-vs-foreground shadow-md fixed w-full top-0">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="text-lg font-semibold">
            <Link href="/" className="hover:text-vs-primary">
              {profile?.fullname}
            </Link>
        </div>
        <ul className="flex space-x-4">
          {content.map((link: { href: string; label: string }) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-vs-primary">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}