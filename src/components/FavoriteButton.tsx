/*
  FavoriteButton omogućuje dodavanje ili uklanjanje serije iz favorita i prikazuje status bez preusmjeravanja.
  Zašto: Koristi se useEffect za dohvat trenutnog stanja favorita s backend API-ja kako bi se prikazao ispravan status tipke nakon mountanja ili promjene showId.
  Kako: handleToggleFavorite šalje POST ili DELETE zahtjev na /api/favorites ovisno o trenutnom statusu, a zatim ažurira lokalni state.
*/
'use client';

import { useState, useEffect } from 'react';

export default function FavoriteButton({ showId }: { showId: number }) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect dohvaća favorite s backend API-ja kad se promijeni showId
  useEffect(() => {
    fetch('/api/favorites')
      .then(res => res.json())
      .then((ids: number[]) => setIsFavorite(ids.includes(showId)));
  }, [showId]);

  // handleToggleFavorite šalje POST ili DELETE zahtjev ovisno o statusu
  const handleToggleFavorite = async () => {
    setLoading(true);
    if (isFavorite) {
      await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: showId }),
      });
      setIsFavorite(false);
    } else {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: showId }),
      });
      setIsFavorite(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`px-4 py-2 rounded font-bold transition ${
        isFavorite
          ? 'bg-red-400 text-red-900 hover:bg-red-500'
          : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
      }`}
    >
      {loading
        ? 'Spremanje...'
        : isFavorite
        ? 'Izbaci iz favorita'
        : 'Dodaj u favorite'}
    </button>
  );
}
