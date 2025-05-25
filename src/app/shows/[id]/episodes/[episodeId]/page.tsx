// src/app/shows/[id]/episodes/[episodeId]/page.tsx
import Link from "next/link";
import Image from "next/image";

interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  summary: string;
  image?: { medium: string };
}

export default async function EpisodeDetail({ params }: { params: Promise<{ id: string; episodeId: string }> }) {
  const { id, episodeId } = await params;
  const res = await fetch(`https://api.tvmaze.com/episodes/${episodeId}`);
  if (!res.ok) return <div>Greška pri dohvaćanju epizode.</div>;
  const episode: Episode = await res.json();

  return (
    <div className="p-4">
      <Link href={`/shows/${id}/episodes`} className="text-blue-500 underline mb-4 inline-block">← Natrag na epizode</Link>
      <h1 className="text-2xl font-bold mb-2">{episode.name}</h1>
      <Image
        src={episode.image?.medium || "/file.svg"}
        alt={episode.name}
        width={150}
        height={155}
        className="rounded mb-3 w-full object-cover aspect-[2/3] bg-gray-100 show-img cursor-pointer hover:opacity-80 transition"
      />
      <div className="mb-2">Sezona: {episode.season}, Epizoda: {episode.number}</div>
      <div className="mb-2">Datum prikazivanja: {episode.airdate}</div>
      <div dangerouslySetInnerHTML={{ __html: episode.summary }} className="mb-4" />
    </div>
  );
}
