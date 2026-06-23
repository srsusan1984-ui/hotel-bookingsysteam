import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowLeft, FaHotel, FaCalendar, FaUsers, FaDollarSign, FaUser } from "react-icons/fa";
import { createBooking } from "../assets/services/bookingService";
import { showSuccessToast, showErrorToast } from "../assets/utilities/toastUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import PromoCodeValidator from "../components/PromoCodeValidator";

import "./BookingPreview.css";

const BookingPreview = () => {
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(null);

  const {
    hotel,
    guests,
    rooms,
    startDate,
    endDate,
    totalAmount,
  } = pageLocation.state || {};

  const nights =
    startDate && endDate
      ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      : 1;

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      await createBooking({
        userId: user._id,
        hotelId: hotel._id,
        hotelName: hotel.hotelName,
        checkIn: startDate,
        checkOut: endDate,
        adults: guests.length,
        children: 0,
        rooms,
        guests,
        totalAmount: discount ? discount.finalAmount : totalAmount,
        discountApplied: discount ? discount.code : null,
      });

      showSuccessToast("Booking confirmed successfully! 🎉");
      navigate("/MyBookings");
    } catch (error) {
      console.log(error);
      showErrorToast(
        error?.response?.data?.message || "Failed to confirm booking"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!hotel || !guests) {
    return <LoadingSpinner />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="booking-preview-container">
      <motion.div
        className="preview-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-back"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Back
        </motion.button>
        <h1>Booking Preview</h1>
        <div style={{ width: '80px' }} />
      </motion.div>

      <div className="preview-content">
        {/* Invoice Card */}
        <motion.div
          className="preview-invoice"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hotel Card */}
          <motion.div
            className="preview-section hotel-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <FaHotel className="section-icon" />
              <h2>Hotel Information</h2>
            </div>

            <div className="info-items">
              <div className="info-item">
                <span className="info-label">Hotel Name</span>
                <p className="info-value">{hotel.hotelName}</p>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <p className="info-value">{hotel.city}, {hotel.state}</p>
              </div>
              <div className="info-item">
                <span className="info-label">Price per Night</span>
                <p className="info-value">₹{hotel.price}</p>
              </div>
            </div>
          </motion.div>

          {/* Booking Details */}
          <motion.div
            className="preview-section booking-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <FaCalendar className="section-icon" />
              <h2>Booking Details</h2>
            </div>

            <div className="info-items booking-grid">
              <div className="info-item">
                <span className="info-label">Check-In</span>
                <p className="info-value">
                  {new Date(startDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="info-item">
                <span className="info-label">Check-Out</span>
                <p className="info-value">
                  {new Date(endDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="info-item">
                <span className="info-label">Nights</span>
                <p className="info-value">{nights}</p>
              </div>
              <div className="info-item">
                <span className="info-label">Rooms</span>
                <p className="info-value">{rooms}</p>
              </div>
            </div>
          </motion.div>

          {/* Guest Details */}
          <motion.div
            className="preview-section guests-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <FaUsers className="section-icon" />
              <h2>Guest Details</h2>
            </div>

            <div className="guests-grid">
              {guests.map((guest, index) => (
                <motion.div
                  key={index}
                  className="guest-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="guest-badge">
                    <FaUser size={14} />
                    Guest {index + 1}
                  </div>

                  <div className="guest-info">
                    <div className="guest-item">
                      <span className="guest-label">Name</span>
                      <p className="guest-value">{guest.name}</p>
                    </div>
                    <div className="guest-item">
                      <span className="guest-label">Age</span>
                      <p className="guest-value">{guest.age} years</p>
                    </div>
                    <div className="guest-item">
                      <span className="guest-label">Gender</span>
                      <p className="guest-value">{guest.gender}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Price Breakdown */}
          <motion.div
            className="preview-section price-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <FaDollarSign className="section-icon" />
              <h2>Price Breakdown</h2>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Room Rate per Night</span>
                <p>₹{hotel.price}</p>
              </div>
              <div className="price-row">
                <span>Number of Nights</span>
                <p>{nights}</p>
              </div>
              <div className="price-row">
                <span>Number of Rooms</span>
                <p>{rooms}</p>
              </div>
              <div className="price-row">
                <span>Subtotal</span>
                <p>₹{hotel.price * nights * rooms}</p>
              </div>
              <div className="price-row taxes">
                <span>Taxes & Fees (included)</span>
                <p>₹0</p>
              </div>

              {discount && (
                <div className="price-row discount">
                  <span>Discount Applied ({discount.code})</span>
                  <p className="discount-amount">-₹{discount.discountAmount.toFixed(2)}</p>
                </div>
              )}

              <div className="price-divider" />

              <div className="price-row total">
                <span>Total Amount</span>
                <p>₹{discount ? discount.finalAmount.toFixed(2) : totalAmount}</p>
              </div>
            </div>

            {/* Promo Code Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginTop: '24px' }}
            >
              <PromoCodeValidator 
                bookingAmount={totalAmount}
                hotelId={hotel?._id}
                onApplyDiscount={(discountData) => setDiscount(discountData)}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="preview-actions"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary btn-lg"
            onClick={handleConfirmBooking}
            disabled={loading}
          >
            <FaCheckCircle size={18} />
            {loading ? "Processing..." : "Confirm Booking"}
          </motion.button>

          <p className="action-note">
            ✓ No payment required now. Secure your booking instantly!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPreview;