import React, { useEffect, useRef } from "react";
import "./TripCategories.css";

function TripCategories() {
  const categories = [
    { title: "Domestic", description: "Explore beautiful destinations within the country." },
    { title: "International", description: "Travel across the globe with our curated packages." },
    { title: "Pilgrimage", description: "Sacred journeys for spiritual fulfillment." },
    { title: "Group Trip", description: "Enjoy travel with friends, family, or like-minded explorers." }
  ];

  const introRef = useRef(null);
  const boxRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pop-up");
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
          Whether you're seeking adventure, relaxation, spirituality, or new cultures,
          we’ve got you covered with our specialized travel experiences.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div
            className="category-box hidden"
            key={index}
            ref={(el) => (boxRefs.current[index] = el)}
            style={{ transitionDelay: `${index * 0.2}s` }}
          >
            <h3>{cat.title}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TripCategories;
