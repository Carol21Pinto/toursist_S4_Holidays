import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PackageDetail.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PackageDetail = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://via.placeholder.com/1200x500/cccccc/666666?text=No+Image";
    const fixedPath = imagePath.replace(/\\/g, "/");
    if (fixedPath.startsWith("http")) return fixedPath;
    return `http://localhost:5000/${fixedPath}`;
  };

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/packages/${id}`);
        if (!response.ok) throw new Error("Package not found");
        const data = await response.json();
        setPackageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPackage();
  }, [id]);

  if (loading) return <div className="status">Loading package details...</div>;
  if (error) return <div className="status error">Error: {error}</div>;
  if (!packageData) return <div className="status">No package data found.</div>;

  return (
    <div className="package-detail">
      {/* Banner */}
      <div className="banner">
        <img
          src={getImageUrl(packageData.cardImage)}
          alt={packageData.title}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/1200x500/cccccc/666666?text=Package+Image")
          }
        />
        <div className="banner-overlay">
          <h1>{packageData.title}</h1>
          <p>
            {packageData.duration} • {packageData.category}
          </p>
        </div>
      </div>

      {/* Pricing */}
      <section className="pricing">
        <h2>Pricing</h2>
        {packageData.pricePerPerson && (
          <p className="price">
            ₹ {packageData.pricePerPerson} <span>{packageData.currency}</span>
          </p>
        )}
        {packageData.priceNote && (
          <p className="price-note">{packageData.priceNote}</p>
        )}
      </section>

      {/* Itinerary */}
      <section className="itinerary">
        <h2>Day-wise Itinerary</h2>
        {packageData.itinerary?.map((day, index) => (
          <div key={index} className="itinerary-card">
            <h3>
              Day {day.day}: {day.title}
            </h3>
            <ul>
              {day.activities?.map((activity, i) => (
                <li key={i}>{activity}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Inclusions & Exclusions */}
      <section className="inclusions-exclusions">
        <div className="inclusions">
          <h2>Inclusions</h2>
          <ul>
            {packageData.inclusions?.map((item, i) => (
              <li key={i}>✔ {item}</li>
            ))}
          </ul>
        </div>
        <div className="exclusions">
          <h2>Exclusions</h2>
          <ul>
            {packageData.exclusions?.map((item, i) => (
              <li key={i}>✘ {item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PackageDetail;
