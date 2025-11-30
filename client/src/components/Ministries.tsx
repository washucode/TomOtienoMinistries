import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Moon, Shield, GraduationCap, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ministries = [
  {
    title: "Deal to Heal",
    description: "A journey of emotional and spiritual restoration. confronting past wounds to find present peace.",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Understanding Dreams",
    description: "Biblical interpretation of dreams and visions. Learn to discern God's voice in the night seasons.",
    icon: Moon,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Deliverance Ministry",
    description: "Breaking free from spiritual strongholds and walking in total liberty through Christ.",
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Master Class Deliverance",
    description: "A full-year intensive course for those called to the ministry of deliverance. Registration open for January.",
    icon: GraduationCap,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
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
    <section id="ministries" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Our Ministries</h2>
          <p className="text-muted-foreground text-lg">
            Specific programs designed to equip, heal, and set you free. Join a community of believers seeking deeper truth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ministries.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 ${item.featured ? 'ring-2 ring-primary/20' : ''}`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <CardTitle className="font-serif text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={item.featured ? "default" : "outline"} 
                    className={`w-full group ${item.featured ? 'bg-primary text-white' : ''}`}
                    onClick={() => handleRegister(item.title)}
                  >
                    Register Now
                    <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register for {selectedMinistry}</DialogTitle>
            <DialogDescription>
              Fill out your details below to secure your spot in this ministry program.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+254..." required />
            </div>
            <Button type="submit" className="w-full bg-primary text-white">Confirm Registration</Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
