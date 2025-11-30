import { Button } from "@/components/ui/button";
import { PlayCircle, Headphones, Calendar, Clock, ExternalLink, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { allVideos } from "@/lib/data";

// Audio sermon data (Podcast style)
const audioSermons = [
  {
    id: 1,
    title: "Dealing with Rejection",
    series: "Emotional Healing",
    date: "Oct 2024",
    duration: "45:00"
  },
  {
    id: 2,
    title: "The Power of Proskuneo",
    series: "Worship & Intimacy",
    date: "Oct 2024",
    duration: "38:30"
  },
  {
    id: 3,
    title: "Foundations of Deliverance",
    series: "School of Ministry",
    date: "Sep 2024",
    duration: "52:15"
  },
  {
    id: 4,
    title: "Walking in Authority",
    series: "Kingdom Identity",
    date: "Sep 2024",
    duration: "41:20"
  }
];

export default function Sermons() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Take first 3 videos for the home page display
  const recentVideos = allVideos.slice(0, 3);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">
            Sermons & Teachings
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Dive deeper into the Word with our latest video messages and audio teachings.
          </p>
        </div>

        {/* Video Sermons */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif text-primary flex items-center gap-2">
              <PlayCircle className="w-6 h-6" /> Latest Video Messages
            </h3>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80"
              onClick={() => setLocation("/videos")}
            >
              View All Videos
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {recentVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
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
                </div>
                <h4 className="font-serif text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{video.date}</span>
                  <span>•</span>
                  <span>{video.views}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Audio Sermons */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif text-primary flex items-center gap-2">
              <Headphones className="w-6 h-6" /> Audio Teachings
            </h3>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Listen on Podcast
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {audioSermons.map((audio, index) => (
              <motion.div
                key={audio.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 p-6 bg-secondary/10 border border-border/50 hover:border-primary/30 hover:bg-secondary/20 transition-all group"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="grow">
                  <h4 className="font-medium text-lg group-hover:text-primary transition-colors">
                    {audio.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-1">{audio.series}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {audio.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {audio.duration}</span>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Player Modal */}
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="sm:max-w-4xl p-0 bg-black border-none overflow-hidden rounded-lg">
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
      </div>
    </section>
  );
}
