import { useQuery } from "@tanstack/react-query";
import { Headphones, Loader2 } from "lucide-react";

export default function Podcast() {
  const { data: podcastSettings, isLoading } = useQuery<{ spotifyShowId: string | null; rssUrl: string | null }>({
    queryKey: ["podcast-settings"],
    queryFn: async () => {
      const res = await fetch("/api/site-settings/podcast");
      if (!res.ok) throw new Error("Failed to fetch podcast settings");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <section id="podcast" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!podcastSettings?.spotifyShowId) {
    return null;
  }

  return (
    <section id="podcast" className="py-24 bg-muted/30" data-testid="section-podcast">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Headphones className="w-8 h-8 text-primary" />
              <h2 className="font-serif text-4xl md:text-5xl text-primary" data-testid="text-podcast-title">
                Listen to Our Podcast
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join Rev. Tom Otieno as he shares powerful teachings, testimonies, and insights on healing, deliverance, and walking in divine authority.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border bg-card">
            <iframe
              src={`https://open.spotify.com/embed/show/${podcastSettings.spotifyShowId}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Rev. Tom Otieno Podcast"
              className="w-full"
              data-testid="iframe-spotify-podcast"
            />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Available on Spotify and all major podcast platforms
          </p>
        </div>
      </div>
    </section>
  );
}
