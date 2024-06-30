import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import { Hero, ProductVariants, VideoCarousel } from "./sections";
import ProductShowcase from "./sections/newHeader";
import Features from "./sections/features";

function App() {
  // gsap.registerPlugin(ScrollTrigger);
  return (
    <>
      <Hero />
      {/* <div className="h-[100vh]">test</div> */}
      {/* <VideoCarousel /> */}
      <Features />
      {/* <ProductShowcase /> */}
      {/* <ProductVariants /> */}
      <div className="h-[100vh]">test</div>
    </>
  );
}

export default App;
