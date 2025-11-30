import bookCover from "@assets/generated_images/elegant_book_cover_mockup.png";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function Book() {
  return (
    <section id="book" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
              <img src={bookCover} alt="Book Cover" className="w-full h-auto" />
            </div>
            {/* Decorative background shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Unlock Your Spiritual Freedom</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Rev. Tom Otieno's latest book offers a comprehensive guide to understanding spiritual warfare, healing, and deliverance. A must-read for anyone seeking a deeper walk with God.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Understanding the roots of spiritual bondage",
                "Practical steps to self-deliverance",
                "Prayers for healing and restoration",
                "Biblical foundations for freedom"
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8">
                Order Your Copy
              </Button>
              <span className="text-lg font-bold text-primary">KES 1,500</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
