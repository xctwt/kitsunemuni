"use client";

import React, { useEffect, useState } from "react";
import { useAnimeStore } from "@/store/anime-store";

import { IWatchedAnime } from "@/types/watched-anime";
import VideoPlayer from "@/components/video-player";
import { useGetEpisodeData } from "@/query/get-episode-data";
import { useGetEpisodeServers } from "@/query/get-episode-servers";
import { getFallbackServer } from "@/utils/fallback-server";
import { Captions, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoPlayerSection = () => {
  const { selectedEpisode, anime } = useAnimeStore();

  const { data: serversData } = useGetEpisodeServers(selectedEpisode);

  const [serverName, setServerName] = useState<string>("");
  const [key, setKey] = useState<string>("");

  useEffect(() => {
    const { serverName, key } = getFallbackServer(serversData);
    setServerName(serverName);
    setKey(key);
  }, [serversData]);

  const { data: episodeData, isLoading } = useGetEpisodeData(
    selectedEpisode,
    serverName,
    key,
  );

  const [watchedDetails, setWatchedDetails] = useState<Array<IWatchedAnime>>(
    JSON.parse(localStorage.getItem("watched") as string) || [],
  );

  function changeServer(serverName: string, key: string) {
    setServerName(serverName);
    setKey(key);
    const preference = { serverName, key };
    localStorage.setItem("serverPreference", JSON.stringify(preference));
  }

  useEffect(() => {
    if (!Array.isArray(watchedDetails)) {
      localStorage.removeItem("watched");
      return;
    }

    if (episodeData) {
      const existingAnime = watchedDetails.find(
        (watchedAnime) => watchedAnime.anime.id === anime.anime.info.id,
      );

      if (!existingAnime) {
        // Add new anime entry if it doesn't exist
        const updatedWatchedDetails = [
          ...watchedDetails,
          {
            anime: {
              id: anime.anime.info.id,
              title: anime.anime.info.name,
              poster: anime.anime.info.poster,
            },
            episodes: [selectedEpisode],
          },
        ];
        localStorage.setItem("watched", JSON.stringify(updatedWatchedDetails));
        setWatchedDetails(updatedWatchedDetails);
      } else {
        // Update the existing anime entry
        const episodeAlreadyWatched =
          existingAnime.episodes.includes(selectedEpisode);

        if (!episodeAlreadyWatched) {
          // Add the new episode to the list
          const updatedWatchedDetails = watchedDetails.map((watchedAnime) =>
            watchedAnime.anime.id === anime.anime.info.id
              ? {
                  ...watchedAnime,
                  episodes: [...watchedAnime.episodes, selectedEpisode],
                }
              : watchedAnime,
          );

          localStorage.setItem(
            "watched",
            JSON.stringify(updatedWatchedDetails),
          );
          setWatchedDetails(updatedWatchedDetails);
        }
      }
    }
    //eslint-disable-next-line
  }, [episodeData, selectedEpisode]);

  if (isLoading || !episodeData)
    return (
      <div className="min-h-[20vh] sm:min-h-[30vh] max-h-[60vh] md:min-h-[40vh] lg:min-h-[60vh] w-full animate-pulse bg-slate-700 rounded-md"></div>
    );

  // Check if sources array exists and has items
  if (!episodeData.sources || episodeData.sources.length === 0) {
    return (
      <div className="min-h-[30vh] w-full flex items-center justify-center bg-cs-window rounded-md">
        <div className="text-center p-5">
          <h3 className="text-xl font-bold text-red-500 mb-2">No Video Sources Available</h3>
          <p className="text-cs-text">Unable to load video sources for this episode. Please try another server.</p>
          <div className="mt-4">
            {serversData?.sub.map((s, i) => (
              <Button
                key={i}
                className={`m-1 uppercase font-bold`}
                onClick={() => changeServer(s.serverName, "sub")}
              >
                Try {s.serverName}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <VideoPlayer
        key={episodeData.sources[0]?.url || `episode-${selectedEpisode}-${serverName}-${key}`}
        episodeInfo={episodeData}
        animeInfo={{
          title: anime.anime.info.name,
          image: anime.anime.info.poster,
        }}
        subOrDub={key as "sub" | "dub"}
      />
      <div className="bg-[#0f172a] p-5">
        <div className="flex flex-row items-center space-x-5">
          <Captions className="text-red-300" />
          <p className="font-bold text-sm">SUB</p>
          {serversData?.sub.map((s, i) => (
            <Button
              key={i}
              className={`uppercase font-bold ${serverName === s.serverName && key === "sub" && "bg-red-300"}`}
              onClick={() => changeServer(s.serverName, "sub")}
            >
              {s.serverName}
            </Button>
          ))}
        </div>
        {!!serversData?.dub.length && (
          <div className="flex flex-row items-center space-x-5 mt-2">
            <Mic className="text-green-300" />
            <p className="font-bold text-sm">DUB</p>
            {serversData?.dub.map((s, i) => (
              <Button
                key={i}
                className={`uppercase font-bold ${serverName === s.serverName && key === "dub" && "bg-green-300"}`}
                onClick={() => changeServer(s.serverName, "dub")}
              >
                {s.serverName}
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VideoPlayerSection;
