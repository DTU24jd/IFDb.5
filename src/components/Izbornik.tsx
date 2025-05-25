/*
  Izbornik prikazuje grid s checkboxovima za žanrove (prvih 10 najčešćih), pretragu i favorite.
  ZAŠTO: Grid s checkboxovima je pregledniji za filtriranje, a žanrovi su hardkodirani radi brzine i UX-a.
*/
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const GENRES = [
  'Drama', 'Comedy', 'Action', 'Thriller', 'Crime',
  'Science-Fiction', 'Adventure', 'Family', 'Romance', 'Horror',
];

export default function Izbornik() {
  const [showGenres, setShowGenres] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Funkcija za pretragu serija
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  // Funkcija za filtriranje po žanrovima
  const handleGenreChange = (genre: string) => {
    let updated;
    if (selectedGenres.includes(genre)) {
      updated = selectedGenres.filter((g) => g !== genre);
    } else {
      updated = [...selectedGenres, genre];
    }
    setSelectedGenres(updated);
    // Navigacija na početnu s query parametrom za filtriranje
    router.push(`/?genres=${encodeURIComponent(updated.join(','))}`);
  };

  // Prikaz izbornika ovisno o stranici
  const isHome = pathname === '/';
  const showBackToShow = !isHome;

  return (
    <nav className="bg-black text-white mb-6 px-4 py-3 rounded flex flex-wrap gap-4 items-center relative">
      <Link href="/" className="text-white text-xl mr-4">
        IFDb
      </Link>
      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Pretraga serija..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-white bg-black text-white px-2 py-1 rounded focus:outline-none focus:ring focus:border-blue-400 placeholder-white"
        />
        <button
          type="submit"
          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition font-semibold border border-white"
        >
          Pretraži
        </button>
      </form>
      {/* Prikaz filtera samo na početnoj stranici */}
      {isHome && (
        <div className="relative">
          <button
            onClick={() => setShowGenres((g) => !g)}
            className="bg-white text-black px-2 py-1 rounded font-semibold ml-2 border border-white hover:bg-gray-200"
          >
            Filtriraj žanrove
          </button>
          {showGenres && (
            <div className="absolute left-0 mt-2 z-10 bg-black border border-white rounded p-4 shadow-lg grid grid-cols-2 gap-2 w-64">
              {GENRES.map((genre) => (
                <label key={genre} className="flex items-center gap-1 text-white">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="accent-white bg-black border-white"
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      <Link
        href="/favorites"
        className="ml-auto bg-white text-black px-4 py-2 rounded font-bold hover:bg-gray-200 transition border border-white"
      >
        &#11088; Favoriti
      </Link>
      {/* Prikaz tipke za nazad ako nismo na početnoj */}
      {showBackToShow && (
        <button
          onClick={() => router.back()}
          className="ml-4 text-white underline border-none bg-transparent hover:text-gray-300"
        >
          &#8592; Povratak
        </button>
      )}
    </nav>
  );
}
