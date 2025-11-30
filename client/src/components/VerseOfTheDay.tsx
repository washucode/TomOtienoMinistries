import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const verses = [
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
  { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
  { text: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
  { text: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles.", reference: "Isaiah 40:31" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
  { text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?", reference: "Psalm 27:1" },
  { text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" },
  { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", reference: "Romans 8:28" },
  { text: "The name of the Lord is a fortified tower; the righteous run to it and are safe.", reference: "Proverbs 18:10" },
  { text: "He heals the brokenhearted and binds up their wounds.", reference: "Psalm 147:3" },
  { text: "Come to me, all you who are weary and burdened, and I will give you rest.", reference: "Matthew 11:28" },
  { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", reference: "Philippians 4:6" },
  { text: "The Lord will fight for you; you need only to be still.", reference: "Exodus 14:14" },
  { text: "God is our refuge and strength, an ever-present help in trouble.", reference: "Psalm 46:1" },
  { text: "No weapon formed against you shall prosper.", reference: "Isaiah 54:17" },
  { text: "Greater is he that is in you, than he that is in the world.", reference: "1 John 4:4" },
  { text: "The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full.", reference: "John 10:10" },
  { text: "If God is for us, who can be against us?", reference: "Romans 8:31" },
  { text: "Delight yourself in the Lord, and he will give you the desires of your heart.", reference: "Psalm 37:4" },
  { text: "Be still, and know that I am God.", reference: "Psalm 46:10" },
  { text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.", reference: "Psalm 34:18" },
  { text: "Fear not, for I am with you; be not dismayed, for I am your God.", reference: "Isaiah 41:10" },
  { text: "In all your ways acknowledge him, and he will make straight your paths.", reference: "Proverbs 3:6" },
  { text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", reference: "Matthew 6:33" },
  { text: "The joy of the Lord is your strength.", reference: "Nehemiah 8:10" },
  { text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.", reference: "2 Timothy 1:7" },
  { text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.", reference: "John 16:33" },
  { text: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.", reference: "Numbers 6:24-25" },
  { text: "With God all things are possible.", reference: "Matthew 19:26" },
  { text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", reference: "Isaiah 41:10" },
];

function getDailyVerse() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return verses[dayOfYear % verses.length];
}

export default function VerseOfTheDay() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const verse = getDailyVerse();
  
  const verseText = `"${verse.text}" - ${verse.reference}`;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verseText);
      setCopied(true);
      toast({ title: "Copied!", description: "Verse copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy", variant: "destructive" });
    }
  };
  
  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(verseText + "\n\nShared from Rev. Tom Otieno Ministry")}`;
    window.open(url, "_blank");
  };
  
  const shareToFacebook = () => {
    const pageUrl = window.location.href;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(verseText)}`;
    window.open(url, "_blank");
  };
  
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(verseText)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-pink-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full mb-6">
            <span className="text-primary text-sm font-medium tracking-wide uppercase">
              Daily Inspiration
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
            Verse of the Day
          </h2>
          
          <div className="relative bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-primary/10">
            <div className="absolute top-4 left-4 text-6xl text-primary/10 font-serif">"</div>
            <div className="absolute bottom-4 right-4 text-6xl text-primary/10 font-serif rotate-180">"</div>
            
            <blockquote className="relative z-10">
              <p 
                className="text-xl md:text-2xl text-foreground/80 font-serif italic leading-relaxed mb-6"
                data-testid="text-verse-content"
              >
                {verse.text}
              </p>
              <footer 
                className="text-primary font-semibold text-lg"
                data-testid="text-verse-reference"
              >
                — {verse.reference}
              </footer>
            </blockquote>
            
            <div className="mt-8 flex items-center justify-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2 border-primary/30 hover:bg-primary/5"
                    data-testid="button-share-verse"
                  >
                    <Share2 className="w-4 h-4" />
                    Share This Verse
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem onClick={shareToWhatsApp} className="cursor-pointer" data-testid="button-share-whatsapp">
                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer" data-testid="button-share-facebook">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer" data-testid="button-share-twitter">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X (Twitter)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy} className="cursor-pointer" data-testid="button-copy-verse">
                    {copied ? (
                      <><Check className="w-4 h-4 mr-2 text-green-600" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Copy to Clipboard</>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
