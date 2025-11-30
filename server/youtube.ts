interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
}

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      thumbnails: {
        high?: { url: string };
        medium?: { url: string };
        default?: { url: string };
      };
      publishedAt: string;
    };
  }>;
  nextPageToken?: string;
}

interface YouTubeVideoDetailsResponse {
  items: Array<{
    id: string;
    contentDetails: {
      duration: string;
    };
    statistics?: {
      viewCount: string;
    };
  }>;
}

function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function categorizeVideo(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("deliverance") || lowerTitle.includes("unmask") || lowerTitle.includes("soul ties") || lowerTitle.includes("curse") || lowerTitle.includes("spiritual warfare") || lowerTitle.includes("python") || lowerTitle.includes("evil covenant") || lowerTitle.includes("healing") || lowerTitle.includes("trauma") || lowerTitle.includes("rejection") || lowerTitle.includes("emotional") || lowerTitle.includes("reconciliation")) {
    return "Healing & Deliverance";
  }
  if (lowerTitle.includes("parenting") || lowerTitle.includes("children") || lowerTitle.includes("child")) {
    return "Parenting";
  }
  if (lowerTitle.includes("family") || lowerTitle.includes("marriage") || lowerTitle.includes("husband") || lowerTitle.includes("wife") || lowerTitle.includes("firewalling")) {
    return "Family";
  }
  if (lowerTitle.includes("worship") || lowerTitle.includes("proskuneo") || lowerTitle.includes("praise")) {
    return "Worship";
  }
  if (lowerTitle.includes("church") || lowerTitle.includes("congregation") || lowerTitle.includes("message to the church")) {
    return "Church";
  }
  
  return "Sermons & Teachings";
}

export class YouTubeService {
  private apiKey: string | undefined;
  private baseUrl = "https://www.googleapis.com/youtube/v3";

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async searchVideos(query: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      throw new Error("YouTube API key not configured");
    }

    const allVideos: YouTubeVideo[] = [];
    let pageToken: string | undefined;

    while (allVideos.length < maxResults) {
      const searchUrl = new URL(`${this.baseUrl}/search`);
      searchUrl.searchParams.set("part", "snippet");
      searchUrl.searchParams.set("q", query);
      searchUrl.searchParams.set("type", "video");
      searchUrl.searchParams.set("maxResults", Math.min(50, maxResults - allVideos.length).toString());
      searchUrl.searchParams.set("key", this.apiKey);
      if (pageToken) {
        searchUrl.searchParams.set("pageToken", pageToken);
      }

      const searchResponse = await fetch(searchUrl.toString());
      if (!searchResponse.ok) {
        const error = await searchResponse.text();
        throw new Error(`YouTube API error: ${error}`);
      }

      const searchData: YouTubeSearchResponse = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        break;
      }

      const videoIds = searchData.items.map(item => item.id.videoId).join(",");
      
      const detailsUrl = new URL(`${this.baseUrl}/videos`);
      detailsUrl.searchParams.set("part", "contentDetails,statistics");
      detailsUrl.searchParams.set("id", videoIds);
      detailsUrl.searchParams.set("key", this.apiKey);

      const detailsResponse = await fetch(detailsUrl.toString());
      if (!detailsResponse.ok) {
        const error = await detailsResponse.text();
        throw new Error(`YouTube API error: ${error}`);
      }

      const detailsData: YouTubeVideoDetailsResponse = await detailsResponse.json();
      
      const durationMap = new Map<string, { duration: string; views: string }>();
      for (const item of detailsData.items) {
        durationMap.set(item.id, {
          duration: parseDuration(item.contentDetails.duration),
          views: item.statistics?.viewCount ? `${parseInt(item.statistics.viewCount).toLocaleString()} views` : "0 views"
        });
      }

      for (const item of searchData.items) {
        const details = durationMap.get(item.id.videoId);
        allVideos.push({
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high?.url || 
                     item.snippet.thumbnails.medium?.url || 
                     item.snippet.thumbnails.default?.url || "",
          duration: details?.duration || "0:00",
          publishedAt: item.snippet.publishedAt,
        });
      }

      pageToken = searchData.nextPageToken;
      if (!pageToken) break;
    }

    return allVideos;
  }

  async syncVideos(searchQueries: string[]): Promise<{ 
    videos: Array<{ 
      title: string; 
      videoId: string; 
      category: string; 
      thumbnail: string;
      duration: string;
      views: string;
    }> 
  }> {
    if (!this.apiKey) {
      throw new Error("YouTube API key not configured. Please add YOUTUBE_API_KEY to your secrets.");
    }

    const allVideos: YouTubeVideo[] = [];
    const seenIds = new Set<string>();

    for (const query of searchQueries) {
      try {
        const videos = await this.searchVideos(query, 25);
        for (const video of videos) {
          if (!seenIds.has(video.videoId)) {
            seenIds.add(video.videoId);
            allVideos.push(video);
          }
        }
      } catch (error) {
        console.error(`Error searching for "${query}":`, error);
      }
    }

    const videos = allVideos.map(video => ({
      title: video.title,
      videoId: video.videoId,
      category: categorizeVideo(video.title),
      thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
      duration: video.duration,
      views: "0 views"
    }));

    return { videos };
  }
}

export const youtubeService = new YouTubeService();
