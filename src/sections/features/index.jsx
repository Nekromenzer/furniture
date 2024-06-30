/* eslint-disable react/no-unescaped-entities */
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import exploreVideo from "/assets/videos/video1.mp4";
import explore1Img from "/assets/images/feature-1.jpg";
import explore2Img from "/assets/images/feature-2.jpg";

const animateWithGsap = (target, animationProps, scrollProps) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    },
  });
};

const Features = () => {
  const videoRef = useRef();

  useGSAP(() => {
    gsap.to("#exploreVideo", {
      scrollTrigger: {
        trigger: "#exploreVideo",
        toggleActions: "play pause reverse restart",
        start: "-10% bottom",
      },
      onComplete: () => {
        videoRef.current.play();
      },
      onLeave: () => {
        videoRef.current.pause();
      },
      onEnterBack: () => {
        videoRef.current.play();
      },
    });

    animateWithGsap("#features_title", { y: 0, opacity: 1 });
    animateWithGsap(
      ".g_grow",
      { scale: 1, opacity: 1, ease: "power1" },
      { scrub: 5.5 }
    );
    animateWithGsap(".g_text", {
      y: 0,
      opacity: 1,
      ease: "power2.inOut",
      duration: 1,
    });

    animateWithGsap("#header1", { x: 0, opacity: 1 });
    animateWithGsap("#header2", { x: 0, opacity: 1 });
  }, []);

  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50 pb-32">
      <div className="screen-max-width">
        <div className="mb-12 w-full">
          <h1
            id="features_title"
            className="text-stone-500 lg:text-6xl md:text-5xl text-3xl lg:mb-0 mb-5 font-medium opacity-0 translate-y-20 mt-6"
          >
            Explore the full story.
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-24">
            <h2
              className="text-5xl lg:text-7xl font-semibold translate-x-36"
              id="header1"
            >
              Wide range of
            </h2>
            <h2
              className="text-5xl lg:text-7xl font-semibold mt-4 translate-x-[-5rem]"
              id="header2"
            >
              titanium forged Furniture
            </h2>
          </div>

          <div className="flex-center flex-col sm:px-10">
            <div className="relative h-[50vh] w-full flex items-center">
              <video
                playsInline
                id="exploreVideo"
                className="w-full h-full object-cover object-center"
                preload="none"
                muted
                autoPlay
                loop
                ref={videoRef}
              >
                <source src={exploreVideo} type="video/mp4" />
              </video>
            </div>

            <div className="flex flex-col w-full relative">
              <div className="feature-video-container">
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img
                    src={explore1Img}
                    alt="titanium"
                    className="feature-video g_grow"
                  />
                </div>
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img
                    src={explore2Img}
                    alt="titanium 2"
                    className="feature-video g_grow"
                  />
                </div>
              </div>

              <div className="feature-text-container">
                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                    Complementing the robust titanium is our unique 'Woosih'
                    look, a warm and inviting wood-like texture that adds a
                    touch of nature's charm.
                    <span className="text-stone-500">
                      Elevate your space with furniture that embodies both
                      strength and beauty.
                    </span>
                  </p>
                </div>

                <div className="flex-1 flex-center items-start">
                  <p className="feature-text g_text">
                    {/* describe something about titanium furniture */}
                    <span className="text-stone-500">
                      Experience the perfect blend of modern design and timeless
                      elegance with our Titanium Furniture Collection.
                    </span>
                    Crafted with precision, these pieces offer a sleek, metallic
                    finish that exudes sophistication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
