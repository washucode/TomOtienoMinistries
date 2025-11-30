import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Moon, Shield, GraduationCap, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ministries = [
  {
    title: "Deal to Heal",
    description: "Emotional and spiritual restoration. Confronting past wounds to find present peace.",
    icon: Heart,
    tags: ["Healing", "Restoration"],
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Understanding Dreams",
    description: "Biblical interpretation of dreams. Discern God's voice in the night seasons.",
    icon: Moon,
    tags: ["Prophetic", "Wisdom"],
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop"
  },
  {
    title: "Deliverance Ministry",
    description: "Breaking free from spiritual strongholds and walking in total liberty.",
    icon: Shield,
    tags: ["Freedom", "Warfare"],
    image: "https://images.unsplash.com/photo-1507692049790-de58293a4654?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Master Class",
    description: "Intensive full-year course for deliverance ministry. Registration open for January.",
    icon: GraduationCap,
    tags: ["Training", "Mentorship"],
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?q=80&w=2070&auto=format&fit=crop",
    featured: true,
  },
];

export default function Ministries() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState("");

  const handleRegister = (ministry: string) => {
    setSelectedMinistry(ministry);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    toast({
      title: "Registration Received",
      description: `Thank you for registering for ${selectedMinistry}. We will contact you shortly.`,
    });
  };

  return (
    <section id="ministries" className="py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-serif font-light text-foreground mb-6">
              Our Ministries
            </h2>
            <p className="text-muted-foreground text-lg font-light max-w-xl">
              Specific programs designed to equip, heal, and set you free. Join a community seeking deeper truth.
            </p>
          </div>
          <Button variant="outline" className="rounded-none h-12 px-6 border-primary text-primary hover:bg-primary hover:text-white transition-all">
            View All Programs
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ministries.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden bg-white h-[400px] border border-border/50 ${item.featured ? 'lg:col-span-2' : ''}`}
            >
              {/* Background Image on Hover */}
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-0 group-hover:opacity-100" 
                   style={{ backgroundImage: `url(${item.image})` }} />
              <div className="absolute inset-0 bg-primary/90 group-hover:bg-primary/80 transition-colors duration-500 opacity-0 group-hover:opacity-100 mix-blend-multiply" />
              
              {/* Content */}
              <div className="relative z-10 h-full p-8 flex flex-col justify-between transition-colors duration-300 group-hover:text-white">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-secondary/50 group-hover:bg-white/20 rounded-none backdrop-blur-sm transition-colors">
                    <item.icon className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  {item.featured && (
                    <span className="px-3 py-1 bg-primary text-white text-xs uppercase tracking-widest font-medium">
                      Featured
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-3 group-hover:translate-x-2 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-white/90 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-border/50 group-hover:border-white/30 pt-6">
                    <div className="flex gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-xs text-muted-foreground group-hover:text-white/70 uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => handleRegister(item.title)}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Register for {selectedMinistry}</DialogTitle>
            <DialogDescription>
              Secure your spot in this transformative program.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-widest">Full Name</Label>
              <Input id="name" placeholder="John Doe" required className="rounded-none h-12 bg-secondary/20 border-border/50" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" required className="rounded-none h-12 bg-secondary/20 border-border/50" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-xs uppercase tracking-widest">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+254..." required className="rounded-none h-12 bg-secondary/20 border-border/50" />
            </div>
            <Button type="submit" className="w-full bg-primary text-white rounded-none h-12">Confirm Registration</Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
