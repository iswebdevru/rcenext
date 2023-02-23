import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b h-14">
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
