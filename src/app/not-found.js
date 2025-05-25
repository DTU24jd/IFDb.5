// src/app/not-found.js
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Stranica nije pronađena</h1>
      <Link href="/" className="text-blue-500 underline">Povratak na početnu</Link>
    </div>
  );
}
