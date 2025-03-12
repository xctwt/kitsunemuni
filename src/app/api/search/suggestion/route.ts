import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

// Use HiAnime URL instead of GogoAnime
const BASE_URI = "https://hianime.to";
const FALLBACK_URIS = ["https://hianime.sx", "https://hianime.nz"];

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
    
    // Try main URL first
    let data;
    let currentUri = BASE_URI;
    
    try {
      const response = await axios.get(`${currentUri}/search?keyword=${encodeURIComponent(q)}`);
      data = response.data;
    } catch (error) {
      console.warn(`Error with main URL ${currentUri}:`, error);
      
      // Try fallback URLs if main fails
      for (const fallbackUri of FALLBACK_URIS) {
        try {
          console.log(`[API] Trying fallback URL: ${fallbackUri}`);
          const response = await axios.get(`${fallbackUri}/search?keyword=${encodeURIComponent(q)}`);
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
    const suggestions: SuggestionItem[] = [];
    $(".film_list-wrap .flw-item").each((i: number, el: any) => {
      // Only include first 8 suggestions for dropdown
      if (i < 8) {
        const id = $(el).find(".film-detail .film-name a").attr("href")?.split("/").pop() || null;
        const poster = $(el).find(".film-poster img").attr("data-src") || $(el).find(".film-poster img").attr("src") || null;
        const name = $(el).find(".film-detail .film-name a").text().trim() || null;
        
        suggestions.push({
          id,
          poster,
          name,
          jname: "", // HiAnime doesn't provide Japanese names separately
          type: $(el).find(".film-detail .fd-infor .fdi-item").first().text().trim() || "TV",
          rank: $(el).find(".film-detail .fd-infor .fdi-item").last().text().trim() || null,
          moreInfo: [
            $(el).find(".film-detail .fd-infor .fdi-item").last().text().trim() || null
          ]
        });
      }
    });

    // If no results found with the new selector, try an alternative selector
    if (suggestions.length === 0) {
      console.log("[API] Trying alternative selector for HiAnime");
      $(".ani.items .item").each((i: number, el: any) => {
        if (i < 8) {
          const id = $(el).find("a").attr("href")?.split("/").pop() || null;
          const poster = $(el).find("img").attr("src") || null;
          const name = $(el).find(".name").text().trim() || null;
          
          suggestions.push({
            id,
            poster,
            name,
            jname: "", 
            type: "TV", // Default type
            rank: $(el).find(".released").text().trim() || null,
            moreInfo: [
              $(el).find(".released").text().trim() || null
            ]
          });
        }
      });
    }

    console.log(`[API] Found ${suggestions.length} suggestion results for query: "${q}" using ${currentUri}`);
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