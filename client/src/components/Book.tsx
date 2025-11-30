import bookCover from "@assets/generated_images/book_cover_understanding_the_deliverance_ministry.png";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Book() {
  const { toast } = useToast();
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", email: "", phone: "", address: "" });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:revtotieno@gmail.com?subject=Book Order: Understanding The Deliverance Ministry&body=Name: ${orderForm.name}%0AEmail: ${orderForm.email}%0APhone: ${orderForm.phone}%0ADelivery Address: ${orderForm.address}%0A%0AI would like to order a copy of "Understanding The Deliverance Ministry" (KES 1,500)`;
    window.open(mailtoLink, '_blank');
    setOrderOpen(false);
    setOrderForm({ name: "", email: "", phone: "", address: "" });
    toast({
      title: "Order Request Sent",
      description: "Your email client will open to complete the order. We'll contact you shortly.",
    });
  };
  return (
    <section id="book" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
              <img src={bookCover} alt="Understanding The Deliverance Ministry Book Cover" className="w-full h-auto" />
            </div>
            {/* Decorative background shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Understanding The Deliverance Ministry</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Rev. Tom Otieno's essential guide to understanding spiritual warfare, healing, and deliverance. A comprehensive resource for anyone seeking a deeper walk with God and freedom from spiritual bondage.
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
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8"
                onClick={() => setOrderOpen(true)}
                data-testid="button-order-book"
              >
                Order Your Copy
              </Button>
              <span className="text-lg font-bold text-primary">KES 1,500</span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Order Your Copy</DialogTitle>
            <DialogDescription>
              Fill in your details and we'll contact you to arrange delivery. Price: KES 1,500
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOrderSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="order-name">Full Name</Label>
              <Input 
                id="order-name" 
                placeholder="Your full name" 
                value={orderForm.name}
                onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                required 
                data-testid="input-order-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-email">Email</Label>
              <Input 
                id="order-email" 
                type="email" 
                placeholder="your@email.com" 
                value={orderForm.email}
                onChange={(e) => setOrderForm({...orderForm, email: e.target.value})}
                required 
                data-testid="input-order-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-phone">Phone Number</Label>
              <Input 
                id="order-phone" 
                placeholder="+254..." 
                value={orderForm.phone}
                onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                required 
                data-testid="input-order-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-address">Delivery Address</Label>
              <Input 
                id="order-address" 
                placeholder="Your delivery address" 
                value={orderForm.address}
                onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                required 
                data-testid="input-order-address"
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-white" data-testid="button-submit-order">
              Send Order Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
