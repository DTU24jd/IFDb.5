// src/app/api/auth/[...nextauth]/route.ts
/*
  NextAuth route handler za autentikaciju s Googleom.
  ZAŠTO: Omogućuje sigurno prijavljivanje korisnika i vezanje favorita uz korisnički račun.
*/
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async session({ session, token }) {
      // Dodaj korisnički id u session
      if (session.user && token.sub) {
        // NextAuth types ne predviđaju id na useru, pa ga dodajemo ručno
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
