import { clsx } from '@/shared/lib/ui';
import Link from 'next/link';

export type HeaderProps = {
  wide?: boolean;
};

export default function Header({ wide }: HeaderProps) {
  return (
    <header className="relative z-10 bg-white border-b shadow-sm h-14 border-neutral-200">
      <div
        className={clsx({
          'flex items-center justify-between h-full': true,
          container: !wide,
          'px-6': !!wide,
        })}
      >
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
