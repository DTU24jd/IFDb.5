/*
  Početna stranica s infinite scrollom i filtriranjem po žanrovima.
  Zašto: Infinite scroll omogućuje bolji UX za pregledavanje velikog broja serija bez reloadanja stranice.
  Kako: Serije se dohvaćaju paginirano s TVmaze API-ja, a filtriranje po žanrovima koristi useSearchParams i filter funkciju nad dohvaćenim podacima.
*/
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import './globals.css';


// Tip za podatke o seriji (TVmaze API)
type Show = {
  id: number;
  name: string;
  image?: {
    medium: string;
    original: string;
  };
  rating?: {
    average: number;
  };
  genres?: string[];
};

const MAX_PAGES = 5; // TVmaze demo ograničenje

export default function HomePage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();

  // Dodajemo ref za kontrolu inicijalizacije
  const initialized = useRef(false);

  // useEffect koristi se za dohvat podataka s API-ja kad se promijeni stranica (page).
  // Zašto: useEffect je potreban za side-effect (fetch) kad se promijeni page.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (page >= MAX_PAGES) return setHasMore(false);
    setLoading(true);
    fetch(`https://api.tvmaze.com/shows?page=${page}`)
      .then(res => res.json())
      .then((data: Show[]) => {
        setShows(prev => [...prev, ...data]);
        setHasMore(data.length > 0 && page < MAX_PAGES - 1);
        setLoading(false);
      });
  }, [page]);

  // Filtriranje po žanrovima
  // Kako: Ako postoji genres parametar, filtriramo serije tako da svaka mora sadržavati sve odabrane žanrove.
  let filtered = shows;
  const genresParam = searchParams.get('genres');
  if (genresParam) {
    const selected = genresParam.split(',');
    filtered = shows.filter(s => s.genres && selected.every(g => s.genres!.includes(g)));
  }

  // Infinite scroll: učitaj više kad korisnik dođe do dna
  // Zašto: useEffect sluša scroll event i povećava page kad korisnik dođe do dna.
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setPage(p => p + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <main className="p-4">
      <h1 className="text-4xl font-bold mb-6 mt-8 text-center">Popularne TV serije</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Svaki red prikazuje više serija */}
        {filtered.map((show) => (
          <Link key={show.id} href={`/shows/${show.id}`}>
            <div className="show-card cursor-pointer mb-2 hover:shadow-lg transition">
              <Image
                src={show.image?.medium || "/file.svg"}
                alt={show.name}
                width={210}
                height={295}
                className="rounded mb-3 w-full object-cover aspect-[2/3] bg-gray-100 show-img cursor-pointer hover:opacity-80 transition"
              />
              <div className="show-info">
                <h2 className="show-title">{show.name}</h2>
                <p className="show-rating">⭐ {show.rating?.average ?? "N/A"}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {loading && <div className="text-center my-4">Učitavanje...</div>}
      {!hasMore && <div className="text-center my-4 text-gray-500">Nema više serija za prikaz.</div>}
     
    </main>
  );
}
