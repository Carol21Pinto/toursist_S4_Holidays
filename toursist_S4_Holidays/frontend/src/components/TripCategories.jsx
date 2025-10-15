import React, { useEffect, useRef, useState } from "react";
import "./TripCategories.css";
import { Link } from "react-router-dom";

function TripCategories() {
  const [visibleBoxes, setVisibleBoxes] = useState([]);

  const defaultCategories = [
    {
      title: "Domestic",
      description: "Explore beautiful destinations within the country.",
      image: "/images/tajmahal.jpg",
      path: "/domestic",
    },
    {
      title: "International",
      description: "Travel across the globe with our curated packages.",
      image: "/images/Rome.jpg",
      path: "/international",
    },
    {
      title: "Pilgrimage",
      description: "Spiritual journeys to sacred places and holy destinations.",
      image: "/images/temple.jpg",
      path: "/pilgrimage",
    },
    {
      title: "Group Trip",
      description: "Enjoy travel with friends, family, or like-minded explorers.",
      image: "/images/group1.jpg",
      path: "/group-trip",
    },
  ];

  const [categories, setCategories] = useState(defaultCategories);

  const introRef = useRef(null);
  const boxRefs = useRef([]);

  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await fetch("https://your-api.example.com/banners");
        if (!res.ok) throw new Error("Failed to load banners");
        const data = await res.json();

        const mapped = data.map((item) => ({
          title: item.title ?? "Untitled",
          description: item.description ?? "",
          image: item.imageUrl ?? "/images/fallback.jpg",
          path: item.slugPath ?? "/",
        }));

        if (Array.isArray(mapped) && mapped.length > 0) {
          setCategories(mapped);
        }
      } catch (e) {
        // Keep defaults on error
      }
    }
    // loadBanners();
  }, []);

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
            <div
              className="category-bg"
              style={{
                backgroundImage: `url(${
                  cat.image ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop"
                })`,
              }}
              aria-hidden="true"
            />

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
