import ActorClient from "./ActorClient";
import { notFound } from "next/navigation";

interface CastCredit {
  _embedded: {
    show: {
      id: number;
      name: string;
      image?: { medium: string };
    };
    character: {
      name: string;
      image?: { medium: string };
    };
  };
}

interface CrewCredit {
  type: string;
  _embedded: {
    show: {
      id: number;
      name: string;
      image?: { medium: string };
    };
  };
}

interface Actor {
  id: number;
  name: string;
  image?: { medium: string };
  country?: { name: string };
  birthday?: string;
}

// Server Component for the dynamic route
export default async function ActorPage({ params }: { params: Promise<{ actorId: string }> }) {
  const { actorId } = await params;

  // Fetch actor data
  const actorRes = await fetch(`https://api.tvmaze.com/people/${actorId}`);
  if (!actorRes.ok) return notFound();
  const actor: Actor = await actorRes.json();

  // Fetch cast credits
  const creditsRes = await fetch(`https://api.tvmaze.com/people/${actorId}/castcredits?embed[]=show&embed[]=character`);
  const credits: CastCredit[] = creditsRes.ok ? await creditsRes.json() : [];

  // Fetch crew credits
  const crewRes = await fetch(`https://api.tvmaze.com/people/${actorId}/crewcredits?embed[]=show`);
  const crew: CrewCredit[] = crewRes.ok ? await crewRes.json() : [];

  return <ActorClient actor={actor} credits={credits} crew={crew} />;
}
