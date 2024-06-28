import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import { Hero, ProductVariants } from "./sections";

function App() {
  gsap.registerPlugin(ScrollTrigger);
  return (
    <>
      <Hero />
      <div className="h-[100vh]">test</div>
      {/* <ProductVariants /> */}
    </>
  );
}

export default App;
