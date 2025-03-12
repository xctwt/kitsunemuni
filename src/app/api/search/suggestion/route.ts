import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const BASE_URI = "https://www1.gogoanime.ai";

interface SuggestionItem {
  id: string | null;
  poster: string | null;
  name: string | null;
  jname: string;
  type: string;
  rank: string | null;
  moreInfo: (string | null)[];
}

/**
 * Search for anime suggestions based on query
 * @param request - The request object
 * @returns a JSON response containing the search suggestions
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  // Check if the query parameter exists
  if (!q) {
    return NextResponse.json(
      { error: 'Missing query parameter' },
      { status: 400 }
    );
  }

  try {
    console.log(`[API] Searching for anime suggestions with query: "${q}"`);
    const { data } = await axios.get(
      `${BASE_URI}/search.html?keyword=${encodeURIComponent(q)}`
    );
    
    const $ = cheerio.load(data);
    if ($("ul.items").text().match(/Sorry, Not found/g)) {
      return NextResponse.json(
        { data: { suggestions: [] } },
        { status: 200 }
      );
    }

    const suggestions: SuggestionItem[] = [];
    $("div.last_episodes ul.items li").each((i: number, el: any) => {
      // Only include first 8 suggestions for dropdown
      if (i < 8) {
        const id = $(el).children(".name").children("a").attr("href")?.replace("/category/", "") || null;
        suggestions.push({
          id,
          poster: $(el).children(".img").children("a").children("img").attr("src") || null,
          name: $(el).children(".name").children("a").attr("title") || null,
          jname: "", // Gogoanime doesn't provide Japanese names
          type: "TV", // Default type
          rank: $(el).children(".released").text().replace(/Released:/g, "").trim() || null,
          moreInfo: [
            $(el).children(".released").text().replace(/Released:/g, "").trim() || null
          ]
        });
      }
    });

    console.log(`[API] Found ${suggestions.length} suggestion results for query: "${q}"`);
    return NextResponse.json(
      { data: { suggestions } },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Error searching anime suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to search anime suggestions' },
      { status: 500 }
    );
  }
} 