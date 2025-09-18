import React, { useEffect, useRef, useState } from "react";
import "./TripCategories.css";
import { Link } from "react-router-dom";

function TripCategories() {
  // Only visibility for animation; no toggle/enlarge state needed
  const [visibleBoxes, setVisibleBoxes] = useState([]);

  // UPDATED: Local default categories (REMOVED Pilgrimage - Only 3 cards)
  const defaultCategories = [
    {
      title: "Domestic",
      description: "Explore beautiful destinations within the country.",
      image: "/images/domestic.jpg",
      path: "/domestic",
    },
    {
      title: "International",
      description: "Travel across the globe with our curated packages.",
      image: "/images/international.jpg",
      path: "/international",
    },
    {
      title: "Group Trip",
      description: "Enjoy travel with friends, family, or like-minded explorers.",
      image: "/images/group-trip.jpg",
      path: "/group-trip",
    },
  ];

  // State that will hold either API categories or fallback
  const [categories, setCategories] = useState(defaultCategories);

  const introRef = useRef(null);
  const boxRefs = useRef([]);

  // OPTIONAL: Load images/content from API (replace URL and mapping as needed)
  useEffect(() => {
    async function loadBanners() {
      try {
        // Example shape expected from API (adjust to your API):
        // [{ title, description, imageUrl, slugPath }, ...]
        const res = await fetch("https://your-api.example.com/banners");
        if (!res.ok) throw new Error("Failed to load banners");
        const data = await res.json();

        // Map API fields into our structure; adjust keys as per your response
        const mapped = data.map((item) => ({
          title: item.title ?? "Untitled",
          description: item.description ?? "",
          image: item.imageUrl ?? "/images/fallback.jpg",
          path: item.slugPath ?? "/",
        }));

        // Only set if we received valid items
        if (Array.isArray(mapped) && mapped.length > 0) {
          setCategories(mapped);
        }
      } catch (e) {
        // Keep defaults on error
        // console.warn("Using default categories due to API error:", e);
      }
    }

    // Call only if you want API-driven images.
    // Comment out if you don't have an API yet.
    // loadBanners();
  }, []);

  // Reveal-on-scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pop-up");
            setVisibleBoxes((prev) => {
              const index = boxRefs.current.indexOf(entry.target);
              if (index !== -1 && !prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (introRef.current) observer.observe(introRef.current);
    boxRefs.current.forEach((box) => {
      if (box) observer.observe(box);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="trip-categories">
      <div className="trip-intro hidden" ref={introRef}>
        <h2>Our Travel Categories</h2>
        <p>
          Whether you're seeking adventure, relaxation, or new cultures,
          we've got you covered with our specialized travel experiences.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <Link
            to={cat.path}
            key={`${cat.title}-${index}`}
            className={`category-box ${!visibleBoxes.includes(index) ? "hidden" : ""}`}
            ref={(el) => (boxRefs.current[index] = el)}
            style={{ transitionDelay: `${index * 0.2}s` }}
          >
            {/* Background image as cover for full-bleed banner */}
            <div
              className="category-bg"
              style={{
                // Fallback dummy image so banners look correct before API/local images
                backgroundImage: `url(${
                  cat.image ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop"
                })`,
              }}
              aria-hidden="true"
            />

            {/* Foreground content overlay */}
            <div className="category-content">
              <h3>{cat.title}</h3>
              <p>{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TripCategories;
