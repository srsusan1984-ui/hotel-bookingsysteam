import React, {
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";
import { FaUser, FaCalendar, FaPlus, FaTrash, FaCheckCircle } from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../assets/utilities/toastUtils";

import "./BookingDetails.css";

const BookingDetails = () => {
  const navigate = useNavigate();
  const pageLocation = useLocation();

  const {
    hotel,
    startDate,
    endDate,
    adults,
    children,
    rooms: initialRooms,
  } = pageLocation.state || {};

  const totalGuests = (adults || 0) + (children || 0);
  const [currentStep, setCurrentStep] = useState(1);

  const [guests, setGuests] = useState(
    Array.from(
      {
        length: totalGuests || 1,
      },
      () => ({
        name: "",
        age: "",
        gender: "Male",
      })
    )
  );

  const [errors, setErrors] = useState({});

  const addGuest = () => {
    if (guests.length >= 6) {
      showErrorToast("Maximum 6 guests allowed");
      return;
    }
    setGuests([
      ...guests,
      {
        name: "",
        age: "",
        gender: "Male",
      },
    ]);
  };

  const removeGuest = (index) => {
    if (guests.length === 1) {
      showErrorToast("At least one guest is required");
      return;
    }
    const updated = [...guests];
    updated.splice(index, 1);
    setGuests(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...guests];
    updated[index][field] = value;
    setGuests(updated);
    
    // Clear error for this field
    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const rooms = Math.ceil(guests.length / 2);

  const nights =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 1;

  const totalAmount = nights * hotel.price * rooms;

  const handleContinue = () => {
    const newErrors = {};

    guests.forEach((guest, index) => {
      if (!guest.name.trim()) {
        newErrors[`name-${index}`] = true;
      }

      if (!guest.age) {
        newErrors[`age-${index}`] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showErrorToast("Please fill in all guest details");
      return;
    }

    navigate("/booking-preview", {
      state: {
        hotel,
        guests,
        rooms,
        startDate,
        endDate,
        totalAmount,
      },
    });
  };

  if (!hotel) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="booking-details-container">
      {/* Progress Indicator */}
      <motion.div
        className="progress-indicator"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="progress-step active">
          <div className="step-number">1</div>
          <span>Guest Details</span>
        </div>
        <div className="progress-line" />
        <div className="progress-step">
          <div className="step-number">2</div>
          <span>Preview</span>
        </div>
        <div className="progress-line" />
        <div className="progress-step">
          <div className="step-number">3</div>
          <span>Payment</span>
        </div>
      </motion.div>

      <div className="booking-details-content">
        {/* Main Form */}
        <motion.div
          className="booking-details-main"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Guest Information</h2>
          <p className="section-description">
            Please provide details for all guests
          </p>

          {guests.map((guest, index) => (
            <motion.div
              key={index}
              className="guest-card-modern"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="guest-card-header">
                <div className="guest-badge">
                  <FaUser size={14} />
                  <span>Guest {index + 1}</span>
                </div>
                {guests.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-remove"
                    onClick={() => removeGuest(index)}
                  >
                    <FaTrash size={16} />
                  </motion.button>
                )}
              </div>

              <div className="guest-form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={guest.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                    className={`form-input ${
                      errors[`name-${index}`] ? "error" : ""
                    }`}
                  />
                  {errors[`name-${index}`] && (
                    <span className="error-text">Name is required</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    value={guest.age}
                    onChange={(e) =>
                      handleChange(index, "age", e.target.value)
                    }
                    className={`form-input ${
                      errors[`age-${index}`] ? "error" : ""
                    }`}
                  />
                  {errors[`age-${index}`] && (
                    <span className="error-text">Age is required</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={guest.gender}
                    onChange={(e) =>
                      handleChange(index, "gender", e.target.value)
                    }
                    className="form-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-secondary"
            onClick={addGuest}
          >
            <FaPlus size={16} />
            Add Another Guest
          </motion.button>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          className="booking-summary-modern"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Booking Summary</h3>

          <div className="summary-items">
            <div className="summary-item">
              <span className="item-label">Hotel</span>
              <p className="item-value">{hotel.hotelName}</p>
            </div>

            <div className="summary-item">
              <span className="item-label">Check-In</span>
              <p className="item-value">
                {new Date(startDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="summary-item">
              <span className="item-label">Check-Out</span>
              <p className="item-value">
                {new Date(endDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="summary-divider" />

            <div className="summary-item">
              <span className="item-label">Guests</span>
              <p className="item-value">{guests.length}</p>
            </div>

            <div className="summary-item">
              <span className="item-label">Rooms</span>
              <p className="item-value">{rooms}</p>
            </div>

            <div className="summary-item">
              <span className="item-label">Nights</span>
              <p className="item-value">{nights}</p>
            </div>

            <div className="summary-divider" />

            <div className="summary-item">
              <span className="item-label">Price per Night</span>
              <p className="item-value">₹{hotel.price}</p>
            </div>

            <div className="summary-item">
              <span className="item-label">Room Total</span>
              <p className="item-value">₹{hotel.price * nights * rooms}</p>
            </div>

            <div className="summary-total">
              <span>Total Amount</span>
              <p>₹{totalAmount}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
            onClick={handleContinue}
          >
            <FaCheckCircle size={18} />
            Continue to Preview
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingDetails;