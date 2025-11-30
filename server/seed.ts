import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { videos, ministrySettings } from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed videos from the original data
  const videoData = [
    {
      title: "God's Abundant Mercy",
      videoId: "M7lc1UVf-VE",
      category: "Sermon",
      thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop",
      duration: "45:20",
      views: "1.2K views",
    },
    {
      title: "Understanding Holiness",
      videoId: "M7lc1UVf-VE",
      category: "Teaching",
      thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop",
      duration: "58:45",
      views: "2.5K views",
    },
    {
      title: "The Power of Prayer",
      videoId: "M7lc1UVf-VE",
      category: "Sermon",
      thumbnail: "https://images.unsplash.com/photo-1445445290350-16a63cfaf720?q=80&w=2070&auto=format&fit=crop",
      duration: "1:02:10",
      views: "3.1K views",
    },
    {
      title: "Walking in Divine Authority",
      videoId: "M7lc1UVf-VE",
      category: "Teaching",
      thumbnail: "https://images.unsplash.com/photo-1490122417551-6ee9691429d0?q=80&w=2070&auto=format&fit=crop",
      duration: "55:30",
      views: "1.8K views",
    },
    {
      title: "Breaking Free from Fear",
      videoId: "M7lc1UVf-VE",
      category: "Sermon",
      thumbnail: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop",
      duration: "48:15",
      views: "2.2K views",
    },
    {
      title: "The Art of Worship",
      videoId: "M7lc1UVf-VE",
      category: "Worship",
      thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop",
      duration: "1:10:00",
      views: "4.5K views",
    },
  ];

  console.log("📹 Inserting videos...");
  await db.insert(videos).values(videoData);
  console.log(`✅ Inserted ${videoData.length} videos`);

  // Seed ministry settings
  const ministrySettingsData = [
    {
      ministryType: "deal-to-heal",
      status: "open",
      nextSessionDate: "December 15, 2024",
      nextSessionTime: "10:00 AM - 4:00 PM EAT",
      location: "Nairobi, Kenya",
      capacity: 50,
      currentRegistrations: 0,
    },
    {
      ministryType: "master-class",
      status: "upcoming",
      nextSessionDate: "January 20, 2025",
      nextSessionTime: "9:00 AM - 12:00 PM EAT",
      location: "Online via Zoom",
      capacity: 100,
      currentRegistrations: 0,
    },
    {
      ministryType: "proskuneo",
      status: "open",
      nextSessionDate: "First Friday of Every Month",
      nextSessionTime: "6:00 PM - 9:00 PM EAT",
      location: "Nairobi Central",
      capacity: 200,
      currentRegistrations: 0,
    },
    {
      ministryType: "understanding-dreams",
      status: "closed",
      nextSessionDate: "TBA",
      nextSessionTime: "TBA",
      location: "TBA",
      capacity: 30,
      currentRegistrations: 0,
    },
  ];

  console.log("⚙️ Inserting ministry settings...");
  await db.insert(ministrySettings).values(ministrySettingsData);
  console.log(`✅ Inserted ${ministrySettingsData.length} ministry settings`);

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
