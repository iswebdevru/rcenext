import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative z-10 bg-white border-b shadow-sm h-14 border-neutral-200">
      <div className="container flex items-center justify-between h-full">
        <Link href="/">rcenext</Link>
        <ul className="flex gap-4">
          <li>
            <Link href="/classes">Пары</Link>
          </li>
          <li>item 2</li>
          <li>item 3</li>
          <li>item n</li>
        </ul>
      </div>
    </header>
  );
}
