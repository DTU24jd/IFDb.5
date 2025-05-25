/*
  Prilagođena stranica za prijavu s Google računom.
  Prikazuje Google gumb za prijavu i tipku za povratak na početnu.
*/
'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white p-8 rounded shadow-lg flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Prijava s računom</h1>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition"
        >
          Prijava s Google računom
        </button>
        <Link href="/" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-3 py-1 rounded transition">
          ← Nazad na početnu
        </Link>
      </div>
    </div>
  );
}
