import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allVideos } from "@/lib/data";

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Sermon", "Teaching", "Worship"];

  const filteredVideos = allVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || video.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6">Sermon Archive</h1>
          <p className="text-muted-foreground text-lg font-light mb-8">
            Explore the complete collection of Rev. Tom Otieno's teachings, sermons, and worship sessions.
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <div className="relative w-full md:w-auto grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search sermons..." 
                className="pl-10 h-12 rounded-none bg-secondary/20 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-none h-12 px-6 ${activeCategory === cat ? 'bg-primary text-white' : 'border-border/50'}`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => setSelectedVideo(video.videoId)}
            >
              <div className="relative aspect-video bg-secondary/20 mb-4 overflow-hidden rounded-none">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-6 h-6 text-white fill-white/20" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium">
                  {video.duration}
                </div>
                {video.category && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-white text-[10px] uppercase tracking-wider font-medium">
                    {video.category}
                  </div>
                )}
              </div>
              <h3 className="font-serif text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{video.date}</span>
                <span>•</span>
                <span>{video.views}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>No videos found matching your search.</p>
            <Button 
              variant="link" 
              className="text-primary mt-2"
              onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-5xl p-0 bg-black border-none overflow-hidden rounded-none">
          <DialogTitle className="sr-only">Video Player</DialogTitle>
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            )}
          </div>
          <DialogClose className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
