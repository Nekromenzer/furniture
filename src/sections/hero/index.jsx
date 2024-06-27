import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Hero = () => {
  useGSAP(() => {
    gsap.to("#header", {
      opacity: 1,
      delay: 1.5,
    });
  }, []);
  return (
    <section className="w-full h-screen bg-red-400">
      <h2 id="header" className="text-3xl font-bold text-center opacity-0">
        Best furniture in the world
      </h2>
    </section>
  );
};

export default Hero;
