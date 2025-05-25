/*
  CastPage prikazuje glumačku postavu (cast) za određenu seriju koristeći TVmaze API.
  Kako:
    - Komponenta je server-side (async) i dohvaća podatke o glumcima na serveru radi bržeg prikaza i SEO prednosti.
    - Podaci se prikazuju u gridu, svaki član cast-a prikazuje sliku glumca, ime i ime lika kojeg glumi.
    - Ključ svakog člana grida je kombinacija person.id, character.name i indeksa, što osigurava jedinstvenost čak i ako isti glumac glumi više likova.
  Zašto:
    - Prikaz svih glumaca i njihovih likova korisnicima daje bolji pregled serije.
    - Server-side fetch omogućuje brže učitavanje i bolju indeksaciju za tražilice.
    - Korištenje složenog ključa sprječava React warninge o duplim ključevima.
*/

// src/app/shows/[id]/cast/page.tsx
import Link from "next/link";
import Image from "next/image";

interface CastPerson {
  person: {
    id: number;
    name: string;
    image?: { medium: string };
  };
  character: {
    name: string;
    image?: { medium: string };
  };
}

// Dohvat glumaca na serveru (server-side fetch) omogućuje da se stranica odmah prikaže s podacima, što je važno za SEO i korisničko iskustvo.
export default async function CastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Pozivamo TVmaze API za cast određene serije. Ako dođe do greške, prikazujemo poruku korisniku.
  const res = await fetch(`https://api.tvmaze.com/shows/${id}/cast`);
  if (!res.ok) return <div>Greška pri dohvaćanju glumaca.</div>;
  const cast: CastPerson[] = await res.json();

  return (
    <div className="p-4">
      {/* Navigacija natrag na detalje serije */}
      <Link href={`/shows/${id}`} className="text-blue-500 underline mb-4 inline-block">← Natrag na seriju</Link>
      <h1 className="text-2xl font-bold mb-4">Glumačka postava</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/*
          Korištenje kombinacije person.id, character.name i idx kao key:
          - person.id: jedinstveni identifikator glumca
          - character.name: ime lika (može biti isto za više glumaca, ali rijetko)
          - idx: osigurava jedinstvenost čak i u slučaju duplikata
          Ovo sprječava React warninge o duplim ključevima u listama.
        */}
        {cast.map((c, idx) => (
          <div
            key={`${c.person.id}-${encodeURIComponent(c.character.name)}-${idx}`}
            className="rounded shadow p-2 flex flex-col items-center"
          >
            <Image
              src={c.person.image?.medium || c.character.image?.medium || "/file.svg"}
              alt={c.person.name}
              className="w-24 h-32 object-cover rounded mb-2"
              width={96} // w-24 = 6*16px
              height={128} // h-32 = 8*16px
            />
            <div className="text-center">
              {/* Dodajemo link na stranicu glumca */}
              <Link href={`/actors/${c.person.id}`} className="font-semibold text-blue-700 hover:underline">
                {c.person.name}
              </Link>
              <div className="text-sm text-gray-600">kao {c.character.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
