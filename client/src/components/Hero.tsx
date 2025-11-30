import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import heroBg from "@assets/generated_images/ethereal_church_sanctuary_light.png";
import portrait from "@assets/Rev Tom 5_1764501067497.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function Hero() {
  const [, navigate] = useLocation();

  const scrollToMinistries = () => {
    const element = document.querySelector("#ministries");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToSermons = () => {
    navigate("/videos");
  };
  return (
    <div className="relative min-h-[95vh] flex items-center overflow-hidden bg-background">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text Content - Spans 7 columns with animation */}
          <motion.div 
            className="lg:col-span-7 pt-20 lg:pt-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-primary" />
              <span className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
                Rev. Tom Otieno
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-foreground mb-8 leading-[0.95] tracking-tight">
              Walking in <br />
              <span className="italic text-primary/90">Divine Freedom</span>
            </h1>
            
            <div className="space-y-6 mb-10 text-muted-foreground text-lg md:text-xl max-w-xl font-light leading-relaxed border-l-2 border-primary/10 pl-6">
              <p>
                A dedicated Deliverance Minister and Teacher of the Word. 
                Serving the body of Christ as a Worship & Music Minister, while offering guidance as a trusted Mediator, Counselor, and Mentor.
              </p>
            </div>

            <div className="flex flex-wrap gap-5">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 h-14 text-base tracking-wide"
                onClick={scrollToMinistries}
                data-testid="button-start-journey"
              >
                Start Your Journey
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                className="rounded-none px-8 h-14 text-base group hover:bg-primary/5"
                onClick={goToSermons}
                data-testid="button-latest-sermon"
              >
                <PlayCircle className="mr-3 w-5 h-5 text-primary" />
                Latest Sermon
              </Button>
            </div>
          </motion.div>

          {/* Image Content - Spans 5 columns */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative z-10">
              {/* Main Image with Modern Masking */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={portrait}
                  alt="Rev. Tom Otieno"
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                />
                {/* Glassmorphism Card Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-6 text-white">
                  <p className="font-serif text-2xl italic">"Truth sets you free."</p>
                  <p className="text-xs uppercase tracking-widest mt-2 opacity-80">Anglican Church of Kenya</p>
                </div>
              </div>
              
              {/* Architectural Elements */}
              <div className="absolute -top-12 -right-12 w-full h-full border border-primary/20 -z-10 hidden md:block" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/50 -z-10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
