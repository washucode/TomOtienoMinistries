import { Button } from "@/components/ui/button";
import { PlayCircle, Headphones, Calendar, Clock, ExternalLink, X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { allVideos } from "@/lib/data";

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

        {/* Podcast Embed Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif text-primary flex items-center gap-2">
              <Headphones className="w-6 h-6" /> Rev. Tom Talks Podcast
            </h3>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80"
              onClick={() => window.open("https://open.spotify.com/show/3IMVvqqgDu32UUzue8AM5k", "_blank")}
            >
              Open in Spotify <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="bg-secondary/10 border border-border/50 p-6 lg:p-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="font-serif text-2xl mb-4">Listen to the Latest Episodes</h4>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Join Rev. Tom Otieno as he tackles a variety of topics, making Jesus and Scripture alive for everyday life. From understanding prayer to navigating life's challenges, tune in for spiritual nourishment.
                </p>
                
                <iframe 
                  style={{ borderRadius: "12px" }} 
                  src="https://open.spotify.com/embed/show/3IMVvqqgDu32UUzue8AM5k?utm_source=generator" 
                  width="100%" 
                  height="152" 
                  frameBorder="0" 
                  allowFullScreen 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="shadow-lg"
                ></iframe>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button variant="outline" className="gap-2" onClick={() => window.open("https://podcasts.apple.com/us/podcast/rev-tom-talks/id1546459524", "_blank")}>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Podcasts_%28iOS%29.svg" alt="Apple Podcasts" className="w-5 h-5" />
                     Apple Podcasts
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => window.open("https://open.spotify.com/show/3IMVvqqgDu32UUzue8AM5k", "_blank")}>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify" className="w-5 h-5" />
                     Spotify
                  </Button>
                </div>
              </div>

              <div className="relative aspect-square md:aspect-[4/3] bg-primary/5 hidden md:block overflow-hidden">
                 <img 
                    src="https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2066&auto=format&fit=crop"
                    alt="Podcast Microphone"
                    className="w-full h-full object-cover mix-blend-multiply opacity-80"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md p-6 text-center max-w-xs shadow-xl">
                       <span className="text-primary font-serif text-xl italic block mb-2">"Rev. Tom Talks"</span>
                       <span className="text-xs uppercase tracking-widest text-muted-foreground">New Episodes Weekly</span>
                    </div>
                 </div>
              </div>
            </div>
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
