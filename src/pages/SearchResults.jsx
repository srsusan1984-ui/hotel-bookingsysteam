import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool, FaHeart, FaDollarSign, FaFilter } from "react-icons/fa";
import { getHotels } from "../assets/services/hotelService";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import SearchBar from "./SearchBar";
import "./SearchResults.css";

const SearchResults = () => {
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const searchData = pageLocation.state || {};

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const rooms = searchData.rooms || 1;
  const searchLocation = searchData.location || "";

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await getHotels();
        setHotels(response.data);

        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

 const searchTerm = searchLocation.trim().toLowerCase();

const filteredHotels = hotels.filter((hotel) => {
  const matchesSearch =
    !searchTerm ||
    hotel.hotelName?.toLowerCase().includes(searchTerm) ||
    hotel.city?.toLowerCase().includes(searchTerm) ||
    hotel.state?.toLowerCase().includes(searchTerm);

  const matchesRooms =
    hotel.totalRooms >= rooms;

  const matchesPrice =
    maxPrice === "" ||
    hotel.price <= Number(maxPrice);

  const matchesRating =
    minRating === "" ||
    (hotel.rating || 0) >= Number(minRating);

  return (
    matchesSearch &&
    matchesRooms &&
    matchesPrice &&
    matchesRating
  );
});

  const toggleFavorite = (hotel) => {
    const newFavorites = favorites.some((fav) => fav._id === hotel._id)
      ? favorites.filter((fav) => fav._id !== hotel._id)
      : [...favorites, hotel];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="search-results-container">
      <SearchBar
        initialLocation={searchData.location}
        initialStartDate={searchData.startDate}
        initialEndDate={searchData.endDate}
        initialAdults={searchData.adults}
        initialChildren={searchData.children}
      />

      <div className="results-content">
        {/* Filters Sidebar */}
        <motion.div
          className={`filters-sidebar ${showFilters ? "visible" : ""}`}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="filters-header">
            <h3>
              <FaFilter size={18} />
              Filters
            </h3>
            <button
              className="close-filters"
              onClick={() => setShowFilters(false)}
            >
              ✕
            </button>
          </div>

          {/* Price Filter */}
          <div className="filter-group">
            <label>
              <FaDollarSign size={14} />
              Max Price per Night
            </label>
            <input
              type="number"
              placeholder="Enter max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="filter-input"
            />
            {maxPrice && <p className="filter-result">Max: ₹{maxPrice}</p>}
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <label>Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="filter-input"
            >
              <option value="">All Ratings</option>
              <option value="3">★ 3.0+</option>
              <option value="3.5">★ 3.5+</option>
              <option value="4">★ 4.0+</option>
              <option value="4.5">★ 4.5+</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(maxPrice || minRating) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary"
              onClick={() => {
                setMaxPrice("");
                setMinRating("");
              }}
              style={{ width: "100%", marginTop: "16px" }}
            >
              Reset Filters
            </motion.button>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="results-main">
          {/* Header */}
          <motion.div
            className="results-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1>Search Results</h1>
              <p className="results-meta">
                Found {filteredHotels.length} hotel{filteredHotels.length !== 1 ? "s" : ""} in{" "}
                {searchLocation || "all locations"}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter size={16} />
              Filters
            </motion.button>
          </motion.div>

          {/* Results */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredHotels.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No Hotels Found"
              description="Try adjusting your search filters or selecting a different location"
              action={
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </motion.button>
              }
            />
          ) : (
            <motion.div
              className="results-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredHotels.map((hotel) => (
                <motion.div
                  key={hotel._id}
                  className="hotel-card-modern"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                >
                  {/* Image Container */}
                  <div className="hotel-card-image-container">
                    <img
                      src={hotel.image}
                      alt={hotel.hotelName}
                      className="hotel-card-image"
                    />

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`favorite-btn ${
                        favorites.some((fav) => fav._id === hotel._id)
                          ? "active"
                          : ""
                      }`}
                      onClick={() => toggleFavorite(hotel)}
                    >
                      <FaHeart
                        size={18}
                        fill={
                          favorites.some(
                            (fav) => fav._id === hotel._id
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </motion.button>

                    {hotel.rating && (
                      <div className="hotel-rating-badge">
                        <FaStar size={14} />
                        {hotel.rating}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="hotel-card-content">
                    <h3>{hotel.hotelName}</h3>

                    <div className="hotel-location">
                      <FaMapMarkerAlt size={14} />
                      <span>
                        {hotel.city}, {hotel.state}
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="hotel-amenities">
                      {hotel.amenities?.includes("WiFi") && (
                        <span className="amenity-item">
                          <FaWifi size={12} />
                        </span>
                      )}
                      {hotel.amenities?.includes("Parking") && (
                        <span className="amenity-item">
                          <FaParking size={12} />
                        </span>
                      )}
                      {hotel.amenities?.includes("Pool") && (
                        <span className="amenity-item">
                          <FaSwimmingPool size={12} />
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="hotel-card-footer">
                      <div className="hotel-price">
                        <span className="price-label">from</span>
                        <p>₹{hotel.price}</p>
                        <span className="price-unit">/night</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          navigate(`/hotel/${hotel._id}`, {
                            state: searchData,
                          })
                        }
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {showFilters && (
        <motion.div
          className="filters-overlay"
          onClick={() => setShowFilters(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
};

export default SearchResults;