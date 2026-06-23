import React, {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { FaHeart, FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool } from "react-icons/fa";

import {
  getHotels,
} from "../assets/services/hotelService";

import SearchBar from "./SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import OffersDisplay from "../components/OffersDisplay";

import "../pages/Home.css";
import { motion } from "framer-motion";

const Home = () => {
  const navigate =
    useNavigate();

  const [hotels, setHotels] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "favorites"
        )
      ) || []
    );

  useEffect(() => {
    const fetchHotels =
      async () => {
        try {
          setLoading(true);
          const response =
            await getHotels();

          setHotels(
            response.data
          );
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchHotels();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(
        favorites
      )
    );
  }, [favorites]);

  const toggleFavorite =
    (hotel) => {
      const exists =
        favorites.find(
          (item) =>
            item._id ===
            hotel._id
        );

      if (exists) {
        setFavorites(
          favorites.filter(
            (item) =>
              item._id !==
              hotel._id
          )
        );
      } else {
        setFavorites([
          ...favorites,
          hotel,
        ]);
      }
    };

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
    <div className="home-container">

      <div className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>
            Find Your Perfect Hotel
          </h1>

          <p>
            Discover amazing places to stay at the best prices
          </p>
        </motion.div>
      </div>

      <SearchBar />

      

      <div className="featured-hotels">

        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Featured Hotels
        </motion.h2>

        {loading ? (
          <LoadingSpinner />
        ) : hotels.length === 0 ? (
          <EmptyState
            icon="🏨"
            title="No Hotels Available"
            description="Check back soon for amazing hotel options!"
          />
        ) : (
          <motion.div
            className="hotel-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >

            {hotels.map(
              (hotel) => (
                <motion.div
                  key={
                    hotel._id
                  }
                  className="hotel-card-modern"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  onClick={() =>
                    navigate(
                      `/hotel/${hotel._id}`,
                      { state: { hotel } }
                    )
                  }
                >
                  <div className="hotel-card-image-container">
                    <img
                      src={
                        hotel.image
                      }
                      alt={
                        hotel.hotelName
                      }
                      className="hotel-card-image"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`favorite-btn ${
                        favorites.find(
                          (item) =>
                            item._id ===
                            hotel._id
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(hotel);
                      }}
                    >
                      <FaHeart size={18} />
                    </motion.button>
                    <div className="hotel-card-badge">Featured</div>
                  </div>

                  <div className="hotel-card-content">
                    <div className="hotel-card-header">
                      <h3>
                        {
                          hotel.hotelName
                        }
                      </h3>
                      <div className="hotel-rating">
                        <FaStar size={16} />
                        <span>4.5</span>
                      </div>
                    </div>

                    <div className="hotel-card-location">
                      <FaMapMarkerAlt size={14} />
                      <p>{hotel.city}, {hotel.state}</p>
                    </div>

                    <div className="hotel-card-amenities">
                      <div className="amenity-item" title="WiFi">
                        <FaWifi size={14} />
                      </div>
                      <div className="amenity-item" title="Parking">
                        <FaParking size={14} />
                      </div>
                      <div className="amenity-item" title="Pool">
                        <FaSwimmingPool size={14} />
                      </div>
                    </div>

                    <div className="hotel-card-footer">
                      <div className="hotel-card-price">
                        <span className="price-label">From</span>
                        <p>
                          ₹{
                            hotel.price
                          }
                          <span>/night</span>
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/hotel/${hotel._id}`,
                            { state: { hotel } }
                          );
                        }}
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>

                </motion.div>
              )
            )}

          </motion.div>
        )}

      </div>

    </div>
  );
};

export default Home;