import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendar, FaDollarSign, FaHotel, FaUsers, FaCheckCircle, FaTimesCircle, FaFilter, FaClock } from "react-icons/fa";
import { getAgentHotels } from "./assets/services/hotelService";
import { getHotelBookings } from "./assets/services/bookingService";
import LoadingSpinner from "./components/LoadingSpinner";
import EmptyState from "./components/EmptyState";
import Badge from "./components/Badge";
import "./AgentBookings.css";

const AgentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const agent = JSON.parse(localStorage.getItem("agent"));
      const hotels = await getAgentHotels(agent._id);

      let allBookings = [];
      for (const hotel of hotels.data) {
        const response = await getHotelBookings(hotel._id);
        const bookingsWithHotel = response.data.map((booking) => ({
          ...booking,
          hotelName: hotel.hotelName,
        }));
        allBookings = [...allBookings, ...bookingsWithHotel];
      }

      allBookings.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
      setBookings(allBookings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const groupedBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guests?.some((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .reduce((groups, booking) => {
      const date = new Date(booking.checkIn).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[date]) groups[date] = [];
      groups[date].push(booking);
      return groups;
    }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="agent-bookings-container">
      {/* Header */}
      <motion.div
        className="bookings-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>📅 Bookings Management</h1>
          <p className="bookings-subtitle">View and manage all hotel bookings</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bookings-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="filter-group">
          <FaFilter size={16} />
          <input
            type="text"
            placeholder="Search by hotel name or guest name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-select"
          >
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : Object.keys(groupedBookings).length === 0 ? (
        <EmptyState
          icon="📅"
          title="No Bookings Found"
          description="No bookings match your search or filters"
        />
      ) : (
        <motion.div
          className="bookings-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(groupedBookings).map(([date, bookingsForDate]) => (
            <motion.div key={date} className="date-section" variants={itemVariants}>
              {/* Date Header */}
              <div className="date-header">
                <FaCalendar size={20} />
                <h2>{date}</h2>
                <span className="booking-count">{bookingsForDate.length} bookings</span>
              </div>

              {/* Bookings for this date */}
              <motion.div
                className="bookings-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {bookingsForDate.map((booking) => (
                  <motion.div
                    key={booking._id}
                    className="booking-card-agent"
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                  >
                    {/* Card Header */}
                    <div className="booking-card-header">
                      <div>
                        <h3 className="hotel-name">
                          <FaHotel size={16} />
                          {booking.hotelName}
                        </h3>
                        <p className="guest-count">
                          <FaUsers size={14} />
                          {booking.guests?.length || 0} Guest{(booking.guests?.length || 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Badge status={booking.status} />
                    </div>

                    {/* Card Details Grid */}
                    <div className="booking-details-grid">
                      {/* Check-In */}
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <div>
                          <p className="detail-label">Check-In</p>
                          <p className="detail-value">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Check-Out */}
                      <div className="detail-item">
                        <span className="detail-icon">📤</span>
                        <div>
                          <p className="detail-label">Check-Out</p>
                          <p className="detail-value">
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="detail-item">
                        <FaHotel size={16} className="detail-icon-svg" />
                        <div>
                          <p className="detail-label">Rooms</p>
                          <p className="detail-value">{booking.rooms}</p>
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="detail-item">
                        <FaDollarSign size={16} className="detail-icon-svg" />
                        <div>
                          <p className="detail-label">Total Amount</p>
                          <p className="detail-value">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Guest Details */}
                    {booking.guests && booking.guests.length > 0 && (
                      <div className="guests-section">
                        <p className="guests-title">👥 Guest Details:</p>
                        <div className="guests-list">
                          {booking.guests.map((guest, idx) => (
                            <div key={idx} className="guest-item">
                              <span className="guest-name">{guest.name}</span>
                              <span className="guest-meta">{guest.age} yrs • {guest.gender}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Info */}
                    <div className="booking-footer">
                      <p className="status-info">
                        {booking.status === "Confirmed" && (
                          <>
                            <FaCheckCircle size={14} /> Booking Confirmed
                          </>
                        )}
                        {booking.status === "Pending" && (
                          <>
                            <FaClock size={14} /> Awaiting Confirmation
                          </>
                        )}
                        {booking.status === "Cancelled" && (
                          <>
                            <FaTimesCircle size={14} /> Booking Cancelled
                          </>
                        )}
                        {booking.status === "Completed" && (
                          <>
                            <FaCheckCircle size={14} /> Stay Completed
                          </>
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AgentBookings;