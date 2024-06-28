import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Modal from "./Modal";

const Hero = () => {
  useGSAP(() => {
    gsap.from("#header", {
      opacity: 1,
      duration: 2,
      x: 50,
      ease: "power4.out",
    });

    // animate header when scroll to bottom of #container , header comes down from top
    gsap.to("#header", {
      scrollTrigger: {
        trigger: "#container",
        start: "top top",
        end: "bottom top",
        ease: "power4.in",
        scrub: true,
        markers: true,
      },
      y: 800,
      x: 250,
      opacity: 0,
    });

    // disapear #modal when scroll to bottom of #container
    gsap.to("#modal", {
      scrollTrigger: {
        trigger: "#container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: true,
      },
      opacity: 0,
    });
  }, []);

  return (
    <div className="w-full h-screen pt-8 relative bg-heroHome bg-cover ">
      <h2
        id="header"
        className="text-[6rem] font-bold opacity-0 mt-8 absolute text-stone-900 drop-shadow-[0_1.8px_1.5px_rgba(255,255,255,1)] "
      >
        Best Furniture in the World
      </h2>

      <Modal id="modal" />
    </div>
  );
};

export default Hero;
