/*
  NextAuth frontend provider i login/logout gumbi.
  ZAŠTO: Omogućuje korisniku prijavu/odjavu i vezanje favorita uz korisnički račun.
*/
'use client';

import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function AuthButtons() {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // koristi Next.js hook za ispravno detektiranje rute
  if (status === 'loading') return null;
  if (session) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-green-700 font-semibold">Prijavljeni ste kao {session.user?.name || session.user?.email}</span>
        <button onClick={() => signOut()} className="bg-red-500 text-white px-3 py-1 rounded">Odjava</button>
      </div>
    );
  }
  // Prikazuj gumb za prijavu samo ako nismo na /signin stranici
  if (pathname === '/signin') {
    return null;
  }
  return (
    <button onClick={() => signIn()} className="bg-blue-600 text-white px-3 py-1 rounded" tabIndex={0}>Prijava s računom</button>
  );
}
