import { Button } from "@/components/ui/button";
import { Heart, Moon, Shield, GraduationCap, ArrowUpRight, CalendarDays, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Registration status types for ministry programs
type RegistrationStatus = 'open' | 'closed' | 'upcoming';

// Ministry data interface with registration details
interface Ministry {
  title: string;
  description: string;
  icon: any;
  tags: string[];
  image: string;
  featured?: boolean;
  status: RegistrationStatus;
  nextSession?: string;
  registrationLink?: string;
}

const ministries: Ministry[] = [
  {
    title: "Deal to Heal",
    description: "Emotional and spiritual restoration. Confronting past wounds to find present peace.",
    icon: Heart,
    tags: ["Healing", "Restoration"],
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop",
    status: 'open',
    nextSession: "Registration Ongoing",
  },
  {
    title: "Understanding Dreams",
    description: "Biblical interpretation of dreams. Discern God's voice in the night seasons.",
    icon: Moon,
    tags: ["Prophetic", "Wisdom"],
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop",
    status: 'upcoming',
    nextSession: "Opens Jan 15th, 2025",
  },
  {
    title: "Deliverance Ministry",
    description: "Breaking free from spiritual strongholds and walking in total liberty.",
    icon: Shield,
    tags: ["Freedom", "Warfare"],
    image: "https://images.unsplash.com/photo-1507692049790-de58293a4654?q=80&w=2070&auto=format&fit=crop",
    status: 'open',
    nextSession: "Sessions Weekly",
  },
  {
    title: "Master Class",
    description: "Intensive full-year course for deliverance ministry. Registration open for January.",
    icon: GraduationCap,
    tags: ["Training", "Mentorship"],
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?q=80&w=2070&auto=format&fit=crop",
    featured: true,
    status: 'open',
    nextSession: "Jan 2025 Intake",
  },
];

export default function Ministries() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);

  const handleRegister = (ministry: Ministry) => {
    if (ministry.registrationLink) {
      window.open(ministry.registrationLink, '_blank');
      return;
    }
    
    if (ministry.status === 'closed') {
      toast({
        title: "Registration Closed",
        description: "Registration for this program is currently closed.",
        variant: "destructive",
      });
      return;
    }

    setSelectedMinistry(ministry);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    toast({
      title: "Registration Received",
      description: `Thank you for registering for ${selectedMinistry?.title}. We will contact you shortly.`,
    });
  };

  const getStatusBadge = (status: RegistrationStatus, nextSession?: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge className="bg-green-600 hover:bg-green-700 text-white border-none rounded-none px-3 py-1">
            Registration Open
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge variant="outline" className="border-primary text-primary bg-primary/5 rounded-none px-3 py-1">
            {nextSession || 'Coming Soon'}
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="secondary" className="bg-secondary text-muted-foreground rounded-none px-3 py-1">
            Closed
          </Badge>
        );
    }
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
              Specific programs designed to equip, heal, and set you free. Check session dates and register below.
            </p>
          </div>
          <Button variant="outline" className="rounded-none h-12 px-6 border-primary text-primary hover:bg-primary hover:text-white transition-all">
            View All Programs
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ministries.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden bg-white min-h-[480px] border border-border/50 flex flex-col ${item.featured ? 'lg:col-span-2' : ''}`}
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                 <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                     style={{ backgroundImage: `url(${item.image})` }} />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                 
                 <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="p-2 bg-white/90 backdrop-blur-md">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    {item.featured && (
                      <span className="px-3 py-1 bg-primary text-white text-xs uppercase tracking-widest font-medium">
                        Featured
                      </span>
                    )}
                 </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col grow">
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getStatusBadge(item.status, item.nextSession)}
                  </div>
                  
                  <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{item.nextSession}</span>
                  </div>
                  
                  <Button 
                    onClick={() => handleRegister(item)}
                    className="w-full rounded-none h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={item.status === 'closed'}
                  >
                    {item.status === 'open' ? 'Register Now' : item.status === 'upcoming' ? 'Join Waitlist' : 'Registration Closed'}
                    <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Register for {selectedMinistry?.title}</DialogTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
               <AlertCircle className="w-4 h-4 text-primary" />
               <span>Session: {selectedMinistry?.nextSession}</span>
            </div>
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
