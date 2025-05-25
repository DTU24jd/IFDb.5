/*
  Stranica prikazuje detalje serije, popis glumaca i popis epizoda.
  Omogućuje dodavanje u favorite i navigaciju na detalje epizode.
*/
import { notFound } from "next/navigation";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import Image from "next/image";

// Tip za podatke o seriji (TVmaze API)
type Show = {
  name: string;
  summary: string;
  image?: {
    original: string;
  };
  genres: string[];
  rating: { average: number };
  status: string;
};

// Tip za podatke o glumcima i ekipi (TVmaze API)
type Crew = { person?: { id: number; name: string; image?: { medium: string } }; type?: string };

export default async function ShowDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Dohvaćamo podatke o seriji, glumcima i epizodama s TVmaze API-ja
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  if (!res.ok) return notFound();
  const show: Show = await res.json();

  // Cast i episodes dohvaćamo odvojeno jer su to posebni endpointi
  const castRes = await fetch(`https://api.tvmaze.com/shows/${id}/cast`);
  const cast = castRes.ok ? await castRes.json() : [];
  const episodesRes = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = episodesRes.ok ? await episodesRes.json() : [];

  // Dohvati crew podatke za seriju
  const crewRes = await fetch(`https://api.tvmaze.com/shows/${id}/crew`);
  const crew = crewRes.ok ? await crewRes.json() : [];

  // Zašto: Korištenje id iz params i fetch bez cache-a osigurava svjež prikaz podataka (vidi Next.js docs)

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Poster lijevo */}
        <div className="flex-shrink-0 flex justify-center md:block mb-4 md:mb-0">
          <Image
            src={show.image?.original || '/file.svg'}
            alt={show.name}
            width={350}
            height={500}
            className="w-40 h-auto md:w-full max-w-xs rounded shadow-lg border-4 border-green-200 object-cover"
            priority
          />
        </div>
        {/* Detalji desno */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-black mb-2 text-blue-900 drop-shadow text-center md:text-left">{show.name}</h1>
          <div className="mb-4 text-gray-800 text-sm md:text-base" dangerouslySetInnerHTML={{ __html: show.summary }} />
          <div className="mb-2 flex flex-wrap gap-2 items-center">
            <span className="bg-green-200 text-green-900 px-2 py-1 rounded font-semibold">Žanrovi:</span>
            <span>{show.genres.join(", ")}</span>
          </div>
          <div className="mb-2 flex flex-wrap gap-2 items-center">
            <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded font-semibold">Status:</span>
            <span>{show.status}</span>
          </div>
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded font-semibold">Ocjena:</span>
            <span>{show.rating.average ?? "N/A"}</span>
          </div>
          <div className="flex justify-center md:justify-start">
            <FavoriteButton showId={parseInt(id)} />
          </div>
        </div>
      </div>
      {/* Cast i crew jedan ispod drugog, ispod detalja */}
      <div className="mt-8 md:mt-10">
        {/* Cast sekcija */}
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-green-800 text-center md:text-left">Glumačka postava</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mb-8">
          {cast.slice(0, 8).map((c: { person: { id: number; name: string; image?: { medium: string } }; character: { name: string; image?: { medium: string } } }, idx: number) => (
            <div key={`${c.person.id}-${encodeURIComponent(c.character.name)}-${idx}`} className="rounded shadow p-2 flex flex-col items-center bg-white border border-green-100 hover:shadow-lg transition">
              <Link href={`/actors/${c.person.id}`}> 
                <Image
                  src={c.person.image?.medium || c.character.image?.medium || "/file.svg"}
                  alt={c.person.name}
                  className="w-16 h-20 md:w-20 md:h-28 object-cover rounded mb-2 border border-blue-200 cursor-pointer hover:opacity-80 transition"
                  width={80}
                  height={112}
                />
              </Link>
              <div className="text-center">
                <div className="font-semibold text-blue-900 text-xs md:text-base">{c.person.name}</div>
                <div className="text-xs text-green-700">kao {c.character.name}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Crew sekcija ispod casta */}
        {crew.length > 0 && crew.some((c: Crew) => c.person && c.type) && (
          <div className="mt-8 md:mt-10">
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-purple-800 text-center md:text-left">Ekipa (crew)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mb-8">
              {crew.slice(0, 12).map((c: { person: { id: number; name: string; image?: { medium: string } }; type: string }, idx: number) => (
                c.person && c.type && (
                  <div key={`${c.person.id}-${c.type}-${idx}`} className="rounded shadow p-2 flex flex-col items-center bg-white border border-purple-100 hover:shadow-lg transition">
                    <Link href={`/actors/${c.person.id}`}> 
                      <Image
                        src={c.person.image?.medium || "/file.svg"}
                        alt={c.person.name}
                        className="w-16 h-20 md:w-20 md:h-28 object-cover rounded mb-2 border border-purple-200 cursor-pointer hover:opacity-80 transition"
                        width={80}
                        height={112}
                      />
                    </Link>
                    <div className="text-center">
                      <div className="font-semibold text-purple-900 text-xs md:text-base">{c.person.name}</div>
                      <div className="text-xs text-purple-700">{c.type}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Detalji ispod */}
      <div className="mt-8 md:mt-10">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-blue-800 text-center md:text-left">Epizode</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
          {episodes.slice(0, 4).map((episode: { id: number; season: number; number: number; name: string; airdate: string; image?: { medium: string } }) => (
            <div key={id + '-' + episode.id} className="border p-2 md:p-4 rounded bg-white shadow hover:shadow-lg transition">
              <Link href={`/shows/${id}/episodes/${episode.id}`} className="text-blue-700 hover:text-green-700 font-semibold text-base md:text-lg underline">
                Sezona {episode.season}, Epizoda {episode.number}: {episode.name}
              </Link>
              <p className="text-xs md:text-sm text-gray-600">Datum emitiranja: {episode.airdate}</p>
              {episode.image && (
                <Image src={episode.image.medium} alt={episode.name} className="mt-2 rounded border border-blue-100" width={210} height={295} />
              )}
            </div>
          ))}
        </div>
        {episodes.length > 4 && (
          <div className="mt-4 text-center">
            <Link href={`/shows/${id}/episodes`} className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-4 py-2 rounded transition">
              Prikaži sve epizode
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
