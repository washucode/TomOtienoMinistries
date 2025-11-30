import { Button } from "@/components/ui/button";
import worshipBg from "@assets/generated_images/worship_atmosphere_silhouette.png";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function Proskuneo() {
  return (
    <section id="proskuneo" className="relative py-32 overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={worshipBg}
          alt="Worship Atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium tracking-[0.2em] uppercase border border-white/30 rounded-full">
            Monthly Gathering
          </span>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 font-serif text-primary-foreground tracking-tight">
            Proskuneo
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-light">
            "Soaking Worship"
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12 text-left md:text-center bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-lg">When</h3>
              <p className="text-white/70">First Saturday of Every Month</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-lg">Time</h3>
              <p className="text-white/70">2:00 PM - 6:00 PM</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MapPin className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-lg">Where</h3>
              <p className="text-white/70">Main Sanctuary, Nairobi</p>
            </div>
          </div>

          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-14 text-lg border-none shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]">
            Save My Seat
          </Button>
        </div>
      </div>
    </section>
  );
}
