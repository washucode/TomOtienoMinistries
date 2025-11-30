import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sermons from "@/components/Sermons";
import Ministries from "@/components/Ministries";
import Proskuneo from "@/components/Proskuneo";
import Podcast from "@/components/Podcast";
import Book from "@/components/Book";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Ministries />
        <Sermons />
        <Podcast />
        <Proskuneo />
        <Book />
      </main>
      <Footer />
    </div>
  );
}
