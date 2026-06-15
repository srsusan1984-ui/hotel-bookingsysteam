import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import EmptyState from "../components/EmptyState";
import "./Favorites.css";

const Favorites = () => {
  const navigate = useNavigate();
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="page favorites-page">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>❤️ My Favorites</h1>
        <p className="favorites-subtitle">
          {favorites.length} hotel{favorites.length !== 1 ? "s" : ""} saved
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <EmptyState
          icon="💔"
          title="No Favorite Hotels Yet"
          description="Start exploring and save your favorite hotels to book later"
          action={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={() => navigate("/")}
            >
              Explore Hotels
            </motion.button>
          }
        />
      ) : (
        <motion.div
          className="favorites-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {favorites.map((hotel) => (
            <motion.div
              key={hotel._id}
              className="favorite-card-modern"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className="favorite-card-image-container">
                <img
                  src={hotel.image}
                  alt={hotel.hotelName}
                  className="favorite-card-image"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="favorite-btn active"
                  title="Remove from favorites"
                  onClick={() => {
                    const updatedFavorites = favorites.filter(
                      (fav) => fav._id !== hotel._id
                    );
                    localStorage.setItem(
                      "favorites",
                      JSON.stringify(updatedFavorites)
                    );
                    window.location.reload();
                  }}
                >
                  <FaHeart size={18} />
                </motion.button>
              </div>

              <div className="favorite-card-content">
                <div className="favorite-card-header">
                  <h3>{hotel.hotelName}</h3>
                  <div className="favorite-card-rating">
                    <FaStar size={16} />
                    <span>4.5</span>
                  </div>
                </div>

                <div className="favorite-card-location">
                  <FaMapMarkerAlt size={14} />
                  <p>{hotel.city}</p>
                </div>

                <div className="favorite-card-footer">
                  <div className="favorite-card-price">
                    <span className="price-label">From</span>
                    <p>
                      ₹{hotel.price}
                      <span>/night</span>
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      navigate(`/hotel/${hotel._id}`, { state: { hotel } })
                    }
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;