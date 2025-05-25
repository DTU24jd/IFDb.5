import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Funkcija za dohvat favorita iz cookieja
async function getFavoritesFromCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get('favorites');
  try {
    return raw ? JSON.parse(raw.value) : [];
  } catch {
    return [];
  }
}

// Funkcija za spremanje favorita u cookie
async function setFavoritesToCookie(favorites: number[]) {
  const cookieStore = await cookies();
  cookieStore.set('favorites', JSON.stringify(favorites), {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function GET() {
  const favorites = await getFavoritesFromCookie();
  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const { id } = await request.json();
  const favorites = await getFavoritesFromCookie();
  if (!favorites.includes(id)) {
    favorites.push(id);
    await setFavoritesToCookie(favorites);
  }
  return NextResponse.json({ status: 'added', favorites });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const favorites = await getFavoritesFromCookie();
  const newFavorites = favorites.filter((favId: number) => favId !== id);
  await setFavoritesToCookie(newFavorites);
  return NextResponse.json({ status: 'removed', favorites });
}