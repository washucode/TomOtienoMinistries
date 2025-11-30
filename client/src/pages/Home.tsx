import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ministries from "@/components/Ministries";
import Proskuneo from "@/components/Proskuneo";
import Book from "@/components/Book";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Ministries />
        <Proskuneo />
        <Book />
      </main>
      <Footer />
    </div>
  );
}
