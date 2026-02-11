import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";
// Fallback slides defined inline to avoid dependency on deleted data file
const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  // Fetch Banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/banners");
        const data = res.data;
        // Filter out empty URLs
        const validBanners = data.filter(b => b.url && b.url.trim() !== "");

        if (validBanners.length > 0) {
          const mappedSlides = validBanners.map((b, i) => ({
            id: b.id,
            image: b.url,
            type: b.type,
            title: b.text || "",
            subtitle: b.pillText || "",
            align: i % 2 === 0 ? "left" : "right"
          }));
          setSlides(mappedSlides);
        }
      } catch (error) {
        console.error("Failed to fetch banners");
      }
    };
    fetchBanners();
  }, []);

  // Auto-advance logic
  useEffect(() => {
    let interval;
    const currentSlide = slides[current];

    // If video, handle differently
    if (currentSlide?.type === "video") {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
      }
    } else {
      // Image logic
      if (isPlaying) {
        interval = setInterval(() => {
          setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, current, slides]); // Run when current slide changes

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsPlaying(false); // Pause interaction on manual control
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  // Video ended handler
  const handleVideoEnd = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden rounded-[2.5rem] shadow-2xl mb-16 border border-white/10 group bg-black">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Background Media */}
          <div className="absolute inset-0">
            {slide.type === "video" ? (
              <video
                ref={index === current ? videoRef : null}
                src={slide.image}
                className="w-full h-full object-cover filter brightness-50"
                muted
                playsInline
                onEnded={handleVideoEnd}
              />
            ) : (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover filter brightness-50 contrast-110 saturate-0"
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 max-w-7xl mx-auto">
            <div
              className={`
                flex flex-col space-y-6
                ${slide.align === "center" ? "items-center text-center" : slide.align === "right" ? "items-end text-right" : "items-start text-left"}
             `}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase animate-slide-down">
                {slide.subtitle}
              </span>

              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mix-blend-overlay opacity-90">
                {slide.title && slide.title.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <Link
                to="/shop"
                className="mt-8 group relative px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/20 rounded-xl overflow-hidden transition-all duration-300 flex items-center space-x-3"
              >
                <span className="relative z-10 text-sm font-bold uppercase tracking-widest">
                  Shop Now
                </span>
                <ArrowRight
                  size={18}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Controls Overlay (Glassmorphism) */}
      <div className="absolute bottom-8 left-8 right-8 z-30 flex justify-between items-end">
        {/* Indicators */}
        <div className="flex space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrent(idx);
                setIsPlaying(false);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${idx === current
                ? "w-12 bg-white"
                : "w-4 bg-white/30 hover:bg-white/60"
                }`}
            />
          ))}
        </div>

        {/* Play/Pause & Arrows */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-1" />
            )}
          </button>

          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
