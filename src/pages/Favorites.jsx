import React from "react";
import "./Favorites.css";

const Favorites = () => {
  const favorites =
    JSON.parse(
      localStorage.getItem("favorites")
    ) || [];

  return (
    <div className="favorites-page">
      <h2>Favorite Hotels</h2>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          No favorite hotels yet ❤️
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((hotel) => (
            <div
              key={hotel.id}
              className="favorite-card"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
              />

              <h3>{hotel.name}</h3>

              <p>{hotel.location}</p>

              <p>
                ₹{hotel.price}/night
              </p>

              <button>
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;