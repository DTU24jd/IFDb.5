# IFDB - TV Serije

Aplikacija za pregled i pretraživanje TV serija, glumaca i epizoda s mogućnošću spremanja omiljenih serija po korisničkom računu. Izgrađena je u Next.js-u i koristi TVmaze API.

##  Ključne funkcionalnosti

- Početna lista serija
- Dinamičke rute za detalje serije, glumca i epizode
- Dodavanje i brisanje favorita (privremeno u cookie)
- Stranica `/favorites` za pregled omiljenih serija
- Prikaz 404 stranice za nepostojeće rute
- Deploy na Vercel 

##  Upute za lokalno pokretanje

1. Klonirajte repozitorij:
   ```bash
   git clone https://github.com/DTU24jd/IFDb.5/edit/main/README.md
   cd IFDB-main
   ```

2. Instalirajte ovisnosti:
   ```bash
   npm install
   ```

3. Pokrenite razvojni server:
   ```bash
   npm run dev
   ```
   Aplikacija će biti dostupna na [http://localhost:3000](http://localhost:3000)


##  Build & Deploy

Za produkcijski build pokrenite:
```bash
npm run build
```

Za lokalno testiranje produkcijskog builda:
```bash
npm start
```


 **Link na produkcijsku verziju (Vercel):**
 https://if-db-5-78i4.vercel.app/

##  Poznate greške / TODO

- Favoriti se trenutno spremaju u cookie i nisu trajno vezani uz korisnički račun



---

## Bilješka autora

Ovaj projekt razvijen je kao dio tečaja **JUNIOR Dev** u organizaciji **Digitalna Dalmacija**. Cilj je bio savladati rad s API-ima, autentifikaciju korisnika te moderne alate poput Next.js-a, Tailwind CSS-a i NextAuth-a.

