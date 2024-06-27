import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Modal from "./Modal";

const Hero = () => {
  const modalRef = useRef(null);

  useGSAP(() => {
    gsap.to("#header", {
      opacity: 1,
      duration: 2,
      x: 150,
      ease: "power4.out",
    });
  }, []);
  return (
    <section className="w-full h-screen pt-8  relative">
      <h2
        id="header"
        className="text-[6rem] font-bold  opacity-0 mt-8 absolute"
      >
        Best furniture in the world
      </h2>
      <Modal modalRef={modalRef} />
    </section>
  );
};

export default Hero;
