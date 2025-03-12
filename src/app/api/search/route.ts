import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

const BASE_URI = "https://www.gogoanimes.is/";

interface AnimeItem {
  id: string | null;
  poster: string | null;
  name: string | null;
  jname: string;
  type: string;
  moreInfo: (string | null)[];
  link: string | null;
}

/**
 * Search for anime based on query
 * @param request - The request object
 * @returns a JSON response containing the search results
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
    console.log(`[API] Searching for anime with query: "${q}"`);
    const { data } = await axios.get(
      `${BASE_URI}/search.html?keyword=${encodeURIComponent(q)}`
    );
    
    const $ = cheerio.load(data);
    if ($("ul.items").text().match(/Sorry, Not found/g)) {
      return NextResponse.json(
        { data: { animes: [] } },
        { status: 200 }
      );
    }

    const animes: AnimeItem[] = [];
    $("div.last_episodes ul.items li").each((i: number, el: any) => {
      const id = $(el).children(".name").children("a").attr("href")?.replace("/category/", "") || null;
      animes.push({
        id,
        poster: $(el).children(".img").children("a").children("img").attr("src") || null,
        name: $(el).children(".name").children("a").attr("title") || null,
        jname: "", // Gogoanime doesn't provide Japanese names
        type: "TV", // Default type
        moreInfo: [
          $(el).children(".released").text().replace(/Released:/g, "").trim() || null
        ],
        link: $(el).children(".name").children("a").attr("href") || null,
      });
    });

    console.log(`[API] Found ${animes.length} results for query: "${q}"`);
    return NextResponse.json(
      { data: { animes } },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Error searching anime:', error);
    return NextResponse.json(
      { error: 'Failed to search anime' },
      { status: 500 }
    );
  }
} 