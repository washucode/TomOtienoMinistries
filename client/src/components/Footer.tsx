import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import logo from "@assets/logo_1764501374554.png";

export default function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <img 
              src={logo} 
              alt="Rev. Tom Otieno" 
              className="h-12 w-auto mb-6 invert brightness-0 opacity-90" 
            />
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              Deliverance Minister | Teacher of the Word | Worship and Music Minister | Mediator | Counselor | Mentor
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-primary transition-colors"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors"><Youtube className="w-6 h-6" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 font-serif text-primary">Quick Links</h4>
            <ul className="space-y-3 text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">About Rev. Tom</a></li>
              <li><a href="#ministries" className="hover:text-primary transition-colors">Ministries</a></li>
              <li><a href="#proskuneo" className="hover:text-primary transition-colors">Proskuneo</a></li>
              <li><a href="#book" className="hover:text-primary transition-colors">Books & Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Give / Tithe</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 font-serif text-primary">Contact Us</h4>
            <ul className="space-y-4 text-background/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <span>Anglican Church of Kenya<br />Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+254-722-499786</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>revtotieno@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} Rev. Tom Otieno Ministries. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
