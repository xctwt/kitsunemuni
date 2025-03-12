import { SEARCH_ANIME } from "@/constants/query-keys";
import { api } from "@/lib/api";
import { IAnime } from "@/types/anime";
import { useQuery } from "react-query";

const searchAnime = async (q: string) => {
  if (q === "") {
    return [];
  }
  
  try {
    console.log(`Fetching search results for query: "${q}"`);
    const res = await api.get("/search", {
      params: {
        q: q,
      },
    });
    
    console.log(`Search results received with ${res.data?.data?.animes?.length || 0} results`);
    return res.data.data.animes as IAnime[];
  } catch (error) {
    console.error("Error fetching search results:", error);
    // Re-throw to let react-query handle it
    throw error;
  }
};

export const useGetSearchAnimeResults = (query: string) => {
  return useQuery({
    queryFn: () => searchAnime(query),
    queryKey: [SEARCH_ANIME, query],
    // Don't run the query if the search string is empty
    enabled: query.trim().length > 0,
    // Cache the results for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Retry a failed request 3 times before throwing
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2000 : 1000, 30 * 1000),
  });
};
