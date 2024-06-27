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
    <div className="w-full h-screen pt-8 relative bg-heroHome ">
      <h2
        id="header"
        className="text-[6rem] font-bold  opacity-0 mt-8 absolute text-stone-900 drop-shadow-[0_1.8px_1.5px_rgba(255,255,255,1)] "
      >
        Best Furniture in the World
      </h2>

      <Modal modalRef={modalRef} />
    </div>
  );
};

export default Hero;
