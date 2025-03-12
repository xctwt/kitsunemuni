import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';
import randomUseragent from 'random-useragent';

// Use HiAnime URL instead of GogoAnime
const BASE_URI = "https://hianime.to";
const FALLBACK_URIS = ["https://hianime.sx", "https://hianime.nz"];

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
    
    // Get a random user agent
    const userAgent = randomUseragent.getRandom();
    console.log(`[API] Using User-Agent: ${userAgent}`);
    
    // Shared headers for all requests
    const headers = {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://www.google.com/',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
    };
    
    // Try main URL first
    let data;
    let currentUri = BASE_URI;
    
    try {
      const response = await axios.get(`${currentUri}/search?keyword=${encodeURIComponent(q)}`, { headers });
      data = response.data;
    } catch (error) {
      console.warn(`Error with main URL ${currentUri}:`, error);
      
      // Try fallback URLs if main fails
      for (const fallbackUri of FALLBACK_URIS) {
        try {
          console.log(`[API] Trying fallback URL: ${fallbackUri}`);
          const response = await axios.get(`${fallbackUri}/search?keyword=${encodeURIComponent(q)}`, { headers });
          data = response.data;
          currentUri = fallbackUri;
          break;
        } catch (fallbackError) {
          console.warn(`Error with fallback URL ${fallbackUri}:`, fallbackError);
        }
      }
      
      if (!data) {
        throw new Error('All URLs failed');
      }
    }
    
    const $ = cheerio.load(data);
    
    // Adjust selectors for HiAnime
    const animes: AnimeItem[] = [];
    $(".film_list-wrap .flw-item").each((i: number, el: any) => {
      const id = $(el).find(".film-detail .film-name a").attr("href")?.split("/").pop() || null;
      const poster = $(el).find(".film-poster img").attr("data-src") || $(el).find(".film-poster img").attr("src") || null;
      const name = $(el).find(".film-detail .film-name a").text().trim() || null;
      
      animes.push({
        id,
        poster,
        name,
        jname: "", // HiAnime doesn't provide Japanese names separately
        type: $(el).find(".film-detail .fd-infor .fdi-item").first().text().trim() || "TV",
        moreInfo: [
          $(el).find(".film-detail .fd-infor .fdi-item").last().text().trim() || null
        ],
        link: $(el).find(".film-detail .film-name a").attr("href") || null,
      });
    });

    // If no results found with the new selector, try an alternative selector
    if (animes.length === 0) {
      console.log("[API] Trying alternative selector for HiAnime");
      $(".ani.items .item").each((i: number, el: any) => {
        const id = $(el).find("a").attr("href")?.split("/").pop() || null;
        const poster = $(el).find("img").attr("src") || null;
        const name = $(el).find(".name").text().trim() || null;
        
        animes.push({
          id,
          poster,
          name,
          jname: "", 
          type: "TV", // Default type
          moreInfo: [
            $(el).find(".released").text().trim() || null
          ],
          link: $(el).find("a").attr("href") || null,
        });
      });
    }

    console.log(`[API] Found ${animes.length} results for query: "${q}" using ${currentUri}`);
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