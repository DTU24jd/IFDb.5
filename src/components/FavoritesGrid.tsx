/*
  FavoritesGrid prikazuje grid omiljenih serija i omogućuje njihovo brisanje.
  ZAŠTO: Centralizirano upravljanje favoritima na jednoj stranici poboljšava UX i održavanje koda.
*/
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Show = {
  id: number;
  name: string;
  image?: { medium: string };
};

export default function FavoritesGrid() {
  const [favorites, setFavorites] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dohvati favorite s backend API-ja
  useEffect(() => {
    fetch('/api/favorites')
      .then(res => res.json())
      .then((ids: number[]) =>
        Promise.all(
          ids.map((id) => fetch(`https://api.tvmaze.com/shows/${id}`).then(res => res.json()))
        )
      )
      .then((shows) => { setFavorites(shows); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Brisanje serije iz favorita
  const removeFavorite = async (id: number) => {
    await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setFavorites(favorites.filter((s) => s.id !== id));
  };

  if (loading) return <p>Učitavanje favorita...</p>;
  if (favorites.length === 0) {
    return <p>Nemate spremljene serije.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {favorites.map((show) => (
        <div key={show.id} className="border rounded p-3 shadow bg-white flex flex-col items-center">
          <Link href={`/shows/${show.id}`} className="w-full">
            <Image
              src={show.image?.medium || "/file.svg"}
              alt={show.name}
              width={210}
              height={295}
              className="rounded mb-3 w-full object-cover aspect-[2/3] bg-gray-100 show-img cursor-pointer hover:opacity-80 transition"
            />
            <div className="font-semibold text-center">{show.name}</div>
          </Link>
          <button
            onClick={() => removeFavorite(show.id)}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Ukloni iz favorita
          </button>
        </div>
      ))}
    </div>
  );
}
