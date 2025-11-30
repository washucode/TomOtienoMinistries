// Data interface for video items
export interface Video {
  id: string;
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
  views: string;
  videoId: string; // YouTube ID
  category?: string;
}

// Centralized video data for easy management
export const allVideos: Video[] = [
  {
    id: "v1",
    title: "God's Abundant Mercy",
    date: "Nov 24, 2024",
    duration: "45:20",
    thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop",
    views: "1.2K views",
    videoId: "M7lc1UVf-VE",
    category: "Sermon"
  },
  {
    id: "v2",
    title: "Understanding Holiness",
    date: "Nov 17, 2024",
    duration: "58:45",
    thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop",
    views: "2.5K views",
    videoId: "M7lc1UVf-VE",
    category: "Teaching"
  },
  {
    id: "v3",
    title: "The Power of Prayer",
    date: "Nov 10, 2024",
    duration: "1:02:10",
    thumbnail: "https://images.unsplash.com/photo-1445445290350-16a63cfaf720?q=80&w=2070&auto=format&fit=crop",
    views: "3.1K views",
    videoId: "M7lc1UVf-VE",
    category: "Sermon"
  },
  {
    id: "v4",
    title: "Walking in Divine Authority",
    date: "Nov 03, 2024",
    duration: "55:30",
    thumbnail: "https://images.unsplash.com/photo-1490122417551-6ee9691429d0?q=80&w=2070&auto=format&fit=crop",
    views: "1.8K views",
    videoId: "M7lc1UVf-VE",
    category: "Teaching"
  },
  {
    id: "v5",
    title: "Breaking Free from Fear",
    date: "Oct 27, 2024",
    duration: "48:15",
    thumbnail: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop",
    views: "2.2K views",
    videoId: "M7lc1UVf-VE",
    category: "Sermon"
  },
  {
    id: "v6",
    title: "The Art of Worship",
    date: "Oct 20, 2024",
    duration: "1:10:00",
    thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop",
    views: "4.5K views",
    videoId: "M7lc1UVf-VE",
    category: "Worship"
  }
];
