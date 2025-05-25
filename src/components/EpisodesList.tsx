// components/EpisodeList.tsx

import React from "react";
import Image from "next/image";

type Episode = {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  summary: string;
  image?: {
    medium: string;
    original: string;
  };
};

type Props = {
  episodes: Episode[];
};

const EpisodeList: React.FC<Props> = ({ episodes }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
      {episodes.map((ep) => (
        <div
          key={ep.id}
          className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
        >
          <h2 className="text-lg font-bold">
            S{ep.season}E{ep.number}: {ep.name}
          </h2>
          {ep.image?.medium && (
            <Image
              src={ep.image.medium}
              alt={ep.name}
              width={210}
              height={295}
              className="rounded mb-3 w-full object-cover aspect-[2/3] bg-gray-100 show-img cursor-pointer hover:opacity-80 transition"
            />
          )}
          <p className="text-sm text-gray-600 mt-2">
            {ep.airdate} —{" "}
            <span
              dangerouslySetInnerHTML={{ __html: ep.summary || "Bez opisa." }}
            />
          </p>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;
