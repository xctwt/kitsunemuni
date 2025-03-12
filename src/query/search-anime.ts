import { SEARCH_ANIME } from "@/constants/query-keys";
import { api } from "@/lib/api";
import { ISuggestionAnime } from "@/types/anime";
import { useQuery } from "react-query";

const searchAnime = async (q: string) => {
  if (q === "") {
    return [];
  }
  
  try {
    console.log(`Searching anime with query: "${q}"`);
    const res = await api.get("/search/suggestion", {
      params: {
        q: q,
      },
    });
    
    console.log(`Search response received with ${res.data?.data?.suggestions?.length || 0} results`);
    return res.data.data.suggestions as ISuggestionAnime[];
  } catch (error) {
    console.error("Error searching anime:", error);
    // Re-throw to let react-query handle it
    throw error;
  }
};

export const useSearchAnime = (query: string) => {
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
