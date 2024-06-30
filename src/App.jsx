import "./App.css";
import { Hero, Features, Carousel } from "./sections";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <>
      <Hero />
      {/* <div className="h-[100vh]">test</div> */}
      {/* <VideoCarousel /> */}
      <Features />
      <Carousel />
      {/* <ProductShowcase /> */}
      {/* <ProductVariants /> */}
      <div className="h-[100vh]">test</div>
    </>
  );
}

export default App;
