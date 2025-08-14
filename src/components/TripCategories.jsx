import React, { useEffect, useRef, useState } from "react";
import "./TripCategories.css";

function TripCategories() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [visibleBoxes, setVisibleBoxes] = useState([]);

  const categories = [
    { 
      title: "Domestic", 
      description: "Explore beautiful destinations within the country.",
      image: "/images/domestic.jpg"
    },
    { 
      title: "International", 
      description: "Travel across the globe with our curated packages.",
      image: "/images/international.jpg"
    },
    { 
      title: "Pilgrimage", 
      description: "Sacred journeys for spiritual fulfillment.",
      image: "/images/pilgrimage.jpg"
    },
    { 
      title: "Group Trip", 
      description: "Enjoy travel with friends, family, or like-minded explorers.",
      image: "/images/group-trip.jpg"
    }
  ];

  const introRef = useRef(null);
  const boxRefs = useRef([]);

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

  const handleClick = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="trip-categories">
      <div className="trip-intro hidden" ref={introRef}>
        <h2>Our Travel Categories</h2>
        <p>
          Whether you're seeking adventure, relaxation, spirituality, or new cultures,
          we’ve got you covered with our specialized travel experiences.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`category-box ${!visibleBoxes.includes(index) ? "hidden" : ""} ${activeIndex === index ? "active" : ""}`}
            ref={(el) => (boxRefs.current[index] = el)}
            style={{ transitionDelay: `${index * 0.2}s` }}
            onClick={() => handleClick(index)}
          >
            <h3>{cat.title}</h3>
            <p>{cat.description}</p>

            <div className="category-image">
              <img src={cat.image} alt={cat.title} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TripCategories;
