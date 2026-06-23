import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import axios from "axios";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMapMarkerAlt, FaPhone, FaUsers, FaDoorOpen, FaWifi, FaParking, FaUtensils, FaSwimmingPool, FaCalendar, FaArrowRight } from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../assets/utilities/toastUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

import "./HotelDetails.css";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const searchData = pageLocation.state || {};

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
  searchData.startDate
    ? new Date(searchData.startDate)
    : null,
  searchData.endDate
    ? new Date(searchData.endDate)
    : null,
]);
  const [startDate, endDate] = dateRange;
  const [adults, setAdults] = useState(searchData.adults || 1);
  const [children, setChildren] = useState(searchData.children || 0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/hotels/${id}`
        );
        setHotel(response.data);
      } catch (error) {
        console.log(error);
        showErrorToast("Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  // Calculate room availability based on bookings for selected dates
  useEffect(() => {
    const calculateAvailableRooms = async () => {
      if (!hotel || !startDate || !endDate) {
        setAvailableRooms(hotel?.totalRooms || 0);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/hotels/${id}/availability`,
          {
            params: {
              checkInDate: startDate.toISOString().split("T")[0],
              checkOutDate: endDate.toISOString().split("T")[0],
            },
          }
        );
        // Backend returns nested structure: data.data.availableRooms
        const available = response.data.data?.availableRooms || response.data.availableRooms || 0;
        setAvailableRooms(available);
      } catch (error) {
        console.log("Error fetching availability:", error);
        // Fallback to basic calculation
        setAvailableRooms(Math.max(0, hotel?.totalRooms - 5) || 0);
      }
    };

    calculateAvailableRooms();
  }, [hotel, startDate, endDate, id]);

  const totalGuests = adults + children;
  const rooms = Math.max(1, Math.ceil(totalGuests / 2));

  const handleBooking = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      showErrorToast("Please login first");
      navigate("/Login");
      return;
    }

    if (!startDate || !endDate) {
      showErrorToast("Please select check-in and check-out dates");
      return;
    }

    if (totalGuests === 0) {
      showErrorToast("Please select at least one guest");
      return;
    }

    if (rooms > availableRooms) {
      showErrorToast(
        `Only ${availableRooms} room(s) available for the selected dates`
      );
      return;
    }

    navigate(
      "/booking-details",
      {
        state: {
          hotel,
          startDate,
          endDate,
          adults,
          children,
          rooms,
        },
      }
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!hotel) {
    return (
      <div className="page">
        <h2>Hotel not found</h2>
      </div>
    );
  }

  return (
    <div className="hotel-details-container">
      {/* Hero Image */}
      <motion.div
        className="hotel-details-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={hotel.image}
          alt={hotel.hotelName}
          className="hotel-details-image"
        />
        <div className="hero-overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1>{hotel.hotelName}</h1>
          <div className="hero-rating">
            <span>⭐ 4.5/5</span>
            <span>•</span>
            <span className={availableRooms > 0 ? "available" : "unavailable"}>
              {availableRooms > 0
                ? `${availableRooms}/${hotel.totalRooms} Rooms Available`
                : "No Rooms Available"}
            </span>
          </div>
        </motion.div>
      </motion.div>

      <div className="hotel-details-content">
        <div className="hotel-details-main">
          {/* Hotel Information */}
          <motion.div
            className="info-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2>About This Hotel</h2>
            
            <div className="info-grid">
              <div className="info-card">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <p className="info-label">Location</p>
                  <p className="info-value">{hotel.city}, {hotel.state}</p>
                  <p className="info-detail">{hotel.address}</p>
                </div>
              </div>

              <div className="info-card">
                <FaPhone className="info-icon" />
                <div>
                  <p className="info-label">Contact</p>
                  <p className="info-value">{hotel.phone}</p>
                </div>
              </div>

              <div className="info-card">
                <FaDoorOpen className="info-icon" />
                <div>
                  <p className="info-label">Available Rooms</p>
                  <p className="info-value">{availableRooms}/{hotel.totalRooms}</p>
                </div>
              </div>

              <div className="info-card">
                <span className="info-icon">₹</span>
                <div>
                  <p className="info-label">Price Per Night</p>
                  <p className="info-value">₹{hotel.price}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            className="description-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3>Description</h3>
            <p>{hotel.description}</p>
          </motion.div>

          {/* Amenities */}
          <motion.div
            className="amenities-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3>Amenities</h3>
            <div className="amenities-grid">
              <div className="amenity">
                <FaWifi className="amenity-icon" />
                <span>Free WiFi</span>
              </div>
              <div className="amenity">
                <FaParking className="amenity-icon" />
                <span>Parking</span>
              </div>
              <div className="amenity">
                <FaUtensils className="amenity-icon" />
                <span>Restaurant</span>
              </div>
              <div className="amenity">
                <FaSwimmingPool className="amenity-icon" />
                <span>Swimming Pool</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sticky Booking Card */}
        <motion.div
          className="booking-summary-card"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3>Book Your Stay</h3>

          <div className="booking-form">
            <div className="form-group">
              <label>Check-In & Check-Out</label>
              <div className="date-picker-wrapper">
                <FaCalendar className="date-icon" />
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  placeholderText="Select dates"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="form-input"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Children</label>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="form-input"
                >
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="booking-info">
              <div className="info-row">
                <span>Total Guests:</span>
                <strong>{totalGuests}</strong>
              </div>
              <div className="info-row">
                <span>Rooms Required:</span>
                <strong>{rooms}</strong>
              </div>
              {startDate && endDate && (
                <div className="info-row">
                  <span>Nights:</span>
                  <strong>
                    {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}
                  </strong>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={handleBooking}
            >
              Continue Booking
            </motion.button>

            <p className="booking-note">
              No payment required yet. Secure your booking now!
            </p>
          </div>
        </motion.div>

            </div> {/* hotel-details-content */}

      {/* Reviews Section */}
      <div
        className="reviews-container"
        style={{
          marginTop: "60px",
          paddingBottom: "40px",
        }}
      >
        <ReviewList
          hotelId={id}
          key={refreshReviews}
          onReviewSubmitted={() =>
            setRefreshReviews((prev) => prev + 1)
          }
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ marginTop: "40px" }}
        >
          {JSON.parse(localStorage.getItem("user")) && (
            <ReviewForm
              hotelId={id}
              hotelName={hotel?.hotelName}
              userId={
                JSON.parse(localStorage.getItem("user"))?._id
              }
              onReviewSubmitted={() =>
                setRefreshReviews((prev) => prev + 1)
              }
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HotelDetails;