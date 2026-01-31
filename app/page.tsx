import Navbar from "./components/navbar";
import Hero from "./components/hero";
import About from "./components/about";
import Gallery from "./components/gallery";
import Find from "./components/find";
import Footer from "./components/footer";
import SpaceBackground from "./components/bg/background";

export default function Home() {
  return (
    <>
      <SpaceBackground />
      <Navbar />
      <main className="w-full pt-16">
        <Hero />
        <About />
        <Gallery />
        <Find />
        <Footer />
      </main>
    </>
  );
}
