import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";
import { FaCalendar, FaDollarSign, FaDoorOpen, FaUsers, FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import {
  getUserBookings,
  cancelBooking,
} from "../assets/services/bookingService";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import { showSuccessToast, showErrorToast } from "../assets/utilities/toastUtils";

import "./Pages.css";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user) {
          navigate("/Login");
          return;
        }

        const response = await getUserBookings(user._id);
        setBookings(response.data);
      } catch (error) {
        console.log(error);
        showErrorToast("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);

      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "Cancelled",
              }
            : booking
        )
      );
      showSuccessToast("Booking cancelled successfully");
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to cancel booking");
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.checkIn) > new Date() && b.status !== "Cancelled"
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.checkIn) <= new Date() || b.status === "Cancelled"
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <div className="page">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>📅 My Bookings</h1>
        <p className="page-subtitle">
          Manage your hotel bookings
        </p>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p>Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No Bookings Yet"
          description="Start your journey by booking your first hotel"
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
        <>
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <motion.div
              className="bookings-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2>Upcoming Trips</h2>
              <motion.div
                className="bookings-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {upcomingBookings.map((booking) => (
                  <motion.div
                    key={booking._id}
                    className="booking-card-modern"
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                  >
                    <div className="booking-card-header">
                      <h3>{booking.hotelName}</h3>
                      <Badge status={booking.status} />
                    </div>

                    <div className="booking-card-details">
                      <div className="detail-item">
                        <FaCalendar className="detail-icon" />
                        <div>
                          <span className="detail-label">Check-In</span>
                          <p className="detail-value">
                            {new Date(booking.checkIn).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <FaCalendar className="detail-icon" />
                        <div>
                          <span className="detail-label">Check-Out</span>
                          <p className="detail-value">
                            {new Date(booking.checkOut).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <FaDoorOpen className="detail-icon" />
                        <div>
                          <span className="detail-label">Rooms</span>
                          <p className="detail-value">{booking.rooms}</p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <FaUsers className="detail-icon" />
                        <div>
                          <span className="detail-label">Guests</span>
                          <p className="detail-value">{booking.guests?.length || 0}</p>
                        </div>
                      </div>

                      <div className="detail-item full-width">
                        <FaDollarSign className="detail-icon" />
                        <div>
                          <span className="detail-label">Total Amount</span>
                          <p className="detail-value">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="booking-card-actions">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-danger"
                        onClick={() => handleCancel(booking._id)}
                      >
                        <FaTrash size={14} />
                        Cancel Booking
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <motion.div
              className="bookings-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2>Past Bookings</h2>
              <motion.div
                className="bookings-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {pastBookings.map((booking) => (
                  <motion.div
                    key={booking._id}
                    className="booking-card-modern past"
                    variants={itemVariants}
                  >
                    <div className="booking-card-header">
                      <h3>{booking.hotelName}</h3>
                      <Badge status={booking.status} />
                    </div>

                    <div className="booking-card-details">
                      <div className="detail-item">
                        <FaCalendar className="detail-icon" />
                        <div>
                          <span className="detail-label">Check-In</span>
                          <p className="detail-value">
                            {new Date(booking.checkIn).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <FaCalendar className="detail-icon" />
                        <div>
                          <span className="detail-label">Check-Out</span>
                          <p className="detail-value">
                            {new Date(booking.checkOut).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <FaDoorOpen className="detail-icon" />
                        <div>
                          <span className="detail-label">Rooms</span>
                          <p className="detail-value">{booking.rooms}</p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <FaUsers className="detail-icon" />
                        <div>
                          <span className="detail-label">Guests</span>
                          <p className="detail-value">{booking.guests?.length || 0}</p>
                        </div>
                      </div>

                      <div className="detail-item full-width">
                        <FaDollarSign className="detail-icon" />
                        <div>
                          <span className="detail-label">Total Amount</span>
                          <p className="detail-value">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookings;