import { useEffect, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Modal from "./Modal";

const Hero = () => {
  const featuresRef = useRef(null);

  const texts = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    "Quisquam voluptatum, quia, quos quidem, quas doloremque voluptates quae repellendus unde doloribus officiis.",
    "Quisquam voluptatum, quia, quos",
  ];

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
      right: -300,
    });

    // #features(text) change with sliding effect when load not in scroll
  }, []);

  useEffect(() => {
    let textIndex = 0;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

    const updateText = () => {
      if (featuresRef.current) {
        featuresRef.current.innerText = texts[textIndex];
        textIndex = (textIndex + 1) % texts.length;
      }
    };

    tl.to(featuresRef.current, {
      opacity: 0,
      duration: 0.5,
      onComplete: updateText,
    })
      .to(featuresRef.current, {
        opacity: 1,
        duration: 0.5,
      })
      .to(featuresRef.current, {
        delay: 4, // show the text for 4 seconds
      });

    gsap.to(tl, {
      delay: 0.5, // start after initial delay
      onStart: updateText,
    });

    return () => {
      tl.kill();
    };
  }, [texts]);

  return (
    <div className="w-full h-screen pt-8 relative bg-heroHome bg-cover ">
      <h2
        id="header"
        className="text-[6rem] font-bold opacity-0 mt-8 absolute  text-stone-900 drop-shadow-[0_1.8px_1.5px_rgba(255,255,255,1)] "
      >
        Best Furniture in the World
      </h2>
      <div className="top-1/2 absolute max-w-[40rem] ml-[4rem] backdrop-blur-sm bg-black/30 p-3 rounded-md">
        <p
          className="text-white text-3xl leading-[3rem] font-semibold tracking-wide"
          id="features"
          ref={featuresRef}
        >
          {texts[0]}
        </p>
      </div>

      <Modal id="modal" />
    </div>
  );
};

export default Hero;
