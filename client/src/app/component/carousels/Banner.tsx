"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import style from "@/app/styles/components/banner.module.css";

type Slide = {
  _id: string;
  productId: string;
  title: string;
  name: string;
  price: string;
  description: string;
  images: string[];
  backgroundimg: string[];
  category: string | string[];
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || "";

const Banner = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const SWIPE_THRESHOLD = 50;

  // Fetch banner data
  const fetchSlides = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/banner/`);
      const data = await res.json();
      setSlides(data);
    } catch (error) {
      console.error("Failed to fetch banner data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (slides.length ? (prev + 1) % slides.length : 0));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      slides.length ? (prev - 1 + slides.length) % slides.length : 0
    );
  };

  // Auto-slide
  useEffect(() => {
    if (!paused && slides.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [paused, slides.length, nextSlide]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > SWIPE_THRESHOLD) nextSlide();
    else if (diff < -SWIPE_THRESHOLD) prevSlide();
  };

  if (isLoading) {
    return (
      <div className={style.spinner}>
        <Image
          src="/images/Spinner.svg"
          alt="Loading"
          width={200}
          height={200}
        />
        <p>Loading banner .....</p>
      </div>
    );
  }

  if (!slides.length) {
    return null;
  }

  return (
    <div
      className={style.carouselcontainer}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={style.carousel}>
        {slides.map((slide, index) => {
          const category = Array.isArray(slide.category)
            ? slide.category[0]
            : slide.category?.split(",")[0] || "general";

          const imageUrl =
            slide.images && slide.images.length > 0
              ? `${uploadUrl}${slide.images[0]}`
              : "/images/placeholder.png";
          const bgImage = slide.backgroundimg?.length
            ? `${uploadUrl}${slide.backgroundimg[0]}`
            : "/images/2.jpg";

          return (
            <div
              key={slide._id ?? index}
              className={`${style["carousel-slide"]} ${
                index === currentSlide ? style.active : ""
              }`}
              style={{ display: index === currentSlide ? "flex" : "none" }}
            >
              <div
                className={style.bcontainer}
                style={{ backgroundImage: `url(${bgImage})` }}
              >
                <div className={style.content}>
                  <div className={style.mimage}>
                    <Image
                      src={imageUrl}
                      alt={slide.title}
                      width={400}
                      height={400}
                      priority
                    />
                  </div>
                  <h1 className={style.h1}>{slide.title}</h1>
                  <p className={style.p}>{slide.description}</p>
                  <button
                    id={style.orderNowBtn}
                    onClick={() =>
                      router.push(`/products/${category}/id/${slide.productId}`)
                    }
                  >
                    Shop Now
                  </button>
                </div>
                <div className={style.image}>
                  <Image
                    onClick={() =>
                      router.push(`/products/${category}/id/${slide.productId}`)
                    }
                    src={imageUrl}
                    alt={slide.name}
                    width={400}
                    height={400}
                    priority
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className={style.prev} onClick={prevSlide}>
        ❮
      </button>
      <button className={style.next} onClick={nextSlide}>
        ❯
      </button>
    </div>
  );
};

export default Banner;
