import { Button } from "@/components/ui/button";
import worshipBg from "@assets/generated_images/worship_atmosphere_silhouette.png";
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Proskuneo() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (registration: any) => {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration),
      });
      if (!res.ok) throw new Error("Registration failed");
      return res.json();
    },
    onSuccess: () => {
      setOpen(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
      toast({
        title: "Registration Successful",
        description: "Thank you for registering for Proskuneo. We will contact you shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({
      ministryType: "proskuneo",
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    });
  };
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

          <Button size="lg" onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-14 text-lg border-none shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]">
            Save My Seat
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Register for Proskuneo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-widest">Full Name</Label>
              <Input id="name" placeholder="John Doe" required className="rounded-none h-12 bg-secondary/20 border-border/50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" required className="rounded-none h-12 bg-secondary/20 border-border/50" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-xs uppercase tracking-widest">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+254..." required className="rounded-none h-12 bg-secondary/20 border-border/50" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <Button type="submit" disabled={registerMutation.isPending} className="w-full bg-primary text-white rounded-none h-12">
              {registerMutation.isPending ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Registering...</>
              ) : (
                "Save My Seat"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
