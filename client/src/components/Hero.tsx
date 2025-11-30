import { motion } from "framer-motion";
import heroBg from "@assets/generated_images/ethereal_church_sanctuary_light.png";
import portrait from "@assets/Rev Tom 5_1764501067497.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Sanctuary Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
      </div>

      <div className="container relative z-10 px-4 mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium tracking-wider text-primary uppercase border border-primary/20 rounded-full bg-primary/5">
            Rev. Tom Otieno
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Walking in <br />
            <span className="text-primary italic">Divine Freedom</span>
          </h1>
          
          <div className="space-y-4 mb-8 text-muted-foreground text-lg max-w-lg">
            <p>
              A dedicated <span className="font-semibold text-foreground">Deliverance Minister</span> and <span className="font-semibold text-foreground">Teacher of the Word</span>. 
              Serving the body of Christ as a <span className="font-semibold text-foreground">Worship & Music Minister</span>, while offering guidance as a trusted <span className="font-semibold text-foreground">Mediator, Counselor, and Mentor</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 text-base">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base group border-primary/20 text-primary hover:bg-primary/5">
              Watch Sermons <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] max-w-sm mx-auto">
            <img
              src={portrait}
              alt="Rev. Tom Otieno"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary/90 to-transparent text-white">
              <p className="font-serif text-xl font-bold">Rev. Tom Otieno</p>
              <p className="text-sm opacity-90">Anglican Church of Kenya</p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </div>
  );
}
