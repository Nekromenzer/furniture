import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Carousel = () => {
  const images = [
    {
      src: "/assets/images/carousel-1.jpg",
      description: "Timeless Oak Craft",
      class: "text-stone-300",
    },
    {
      src: "/assets/images/carousel-2.jpg",
      description: "Modern Comfort Zone",
      class: "text-sky-900",
    },
    {
      src: "/assets/images/carousel-3.jpg",
      description: "Urban Chic Vibes",
      class: "text-yellow-500",
    },
    {
      src: "/assets/images/carousel-4.jpg",
      description: "Compact Living Solutions",
      class: "text-zinc-200",
    },
  ];

  const sectionsRef = useRef([]);
  const wrapperRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(0);

  useEffect(() => {
    const sections = sectionsRef.current;

    const getMaxWidth = () => {
      let maxWidth = 0;
      sections.forEach((section) => {
        maxWidth += section.offsetWidth;
      });
      setMaxWidth(maxWidth);
    };

    getMaxWidth();
    ScrollTrigger.addEventListener("refreshInit", getMaxWidth);

    gsap.to(sections, {
      x: () => `-${maxWidth - window.innerWidth}`,
      ease: "none",
      scrollTrigger: {
        trigger: wrapperRef.current,
        pin: true,
        scrub: true,
        end: () => `+=${maxWidth}`,
        invalidateOnRefresh: true,
        id: "carousel-horizontal-scroll", // Unique ID for this ScrollTrigger instance
      },
    });

    const triggers = sections.map((sct, i) =>
      ScrollTrigger.create({
        trigger: sct,
        start: () =>
          "top top-=" +
          (sct.offsetLeft - window.innerWidth / 2) *
            (maxWidth / (maxWidth - window.innerWidth)),
        end: () =>
          "+=" + sct.offsetWidth * (maxWidth / (maxWidth - window.innerWidth)),
        toggleClass: { targets: sct, className: "active" },
        id: `carousel-section-${i}`, // Unique ID for each section ScrollTrigger instance
      })
    );

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", getMaxWidth);
      ScrollTrigger.getById("carousel-horizontal-scroll")?.kill();
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [maxWidth]);

  return (
    <div className="flex flex-nowrap" ref={wrapperRef}>
      {images.map((img, index) => (
        <section
          key={index}
          className={`flex justify-center items-center bg-cover bg-center flex-shrink-0 w-[100vw] min-h-[100vh]`}
          ref={(el) => (sectionsRef.current[index] = el)}
          style={{ backgroundImage: `url(${img.src})` }}
        >
          <div
            className={`text-[6rem] carousel-text-${index} drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-semibold  ${img.class}`}
            id={`carousel-text-${index}`}
          >
            {img.description}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Carousel;
