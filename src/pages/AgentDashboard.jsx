import "./AgentDashboard.css";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaHotel, FaDoorOpen, FaCheckCircle, FaEye } from "react-icons/fa";
import { getAgentHotels, updateHotel, deleteHotel } from "../assets/services/hotelService";
import { showSuccessToast, showErrorToast } from "../assets/utilities/toastUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [totalRooms, setTotalRooms] = useState("");
  const [myHotels, setMyHotels] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const agent = JSON.parse(localStorage.getItem("agent"));
      const response = await getAgentHotels(agent._id);
      setMyHotels(response.data);
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  const AgentDashboard = () => {
  const navigate = useNavigate();

  const [hotelName, setHotelName] = useState("");
  };

  const resetForm = () => {
    setHotelName("");
    setLocation("");
    setAddress("");
    setDescription("");
    setPrice("");
    setPhone("");
    setImage("");
    setTotalRooms("");
    setEditingId(null);
    setIsEditing(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!hotelName.trim()) newErrors.hotelName = "Hotel name is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price || Number(price) <= 0) newErrors.price = "Valid price is required";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (!image.trim()) newErrors.image = "Image URL is required";
    if (!totalRooms || Number(totalRooms) <= 0) newErrors.totalRooms = "Valid room count is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const agent = JSON.parse(localStorage.getItem("agent"));
      const hotelData = {
        hotelName,
        state: location,
        city: location,
        address,
        description,
        price: Number(price),
        phone,
        image,
        totalRooms: Number(totalRooms),
        availableRooms: Number(totalRooms),
        agentId: agent._id,
      };

      if (isEditing) {
        await updateHotel(editingId, hotelData);
        showSuccessToast("Hotel updated successfully!");
      } else {
        await fetch("https://hotel-bookingsystem-backend.onrender.com/api/hotels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hotelData),
        });
        showSuccessToast("Hotel added successfully!");
      }

      resetForm();
      loadHotels();
    } catch (error) {
      console.log(error);
      showErrorToast(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (hotel) => {
    setHotelName(hotel.hotelName);
    setLocation(hotel.city);
    setAddress(hotel.address);
    setDescription(hotel.description);
    setPrice(hotel.price);
    setPhone(hotel.phone);
    setImage(hotel.image);
    setTotalRooms(hotel.totalRooms);
    setEditingId(hotel._id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    try {
      await deleteHotel(id);
      showSuccessToast("Hotel deleted successfully!");
      loadHotels();
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to delete hotel");
    }
  };

  const stats = [
    {
      label: "Total Hotels",
      value: myHotels.length,
      icon: FaHotel,
      color: "#2563eb",
    },
    {
      label: "Total Rooms",
      value: myHotels.reduce((sum, h) => sum + (h.totalRooms || 0), 0),
      icon: FaDoorOpen,
      color: "#059669",
    },
    {
      label: "Available Rooms",
      value: myHotels.reduce((sum, h) => sum + (h.availableRooms || 0), 0),
      icon: FaCheckCircle,
      color: "#d97706",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    
    <div className="dashboard-container">
      {/* Header */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Hotel Management</h1>
        <p className="dashboard-subtitle">Manage your hotel inventory and bookings</p>
      </motion.div>

      {/* Statistics */}
      <motion.div
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div key={index} className="stat-card" variants={itemVariants}>
              <div className="stat-icon" style={{ color: stat.color }}>
                <IconComponent size={32} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="form-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="form-header">
          <h2>{isEditing ? "✏️ Update Hotel" : "➕ Add New Hotel"}</h2>
          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary btn-sm"
              onClick={resetForm}
            >
              Clear
            </motion.button>
          )}
        </div>

        <form className="dashboard-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Hotel Name */}
            <div className="form-group">
              <label className="form-label">Hotel Name *</label>
              <input
                type="text"
                placeholder="Enter hotel name"
                value={hotelName}
                onChange={(e) => {
                  setHotelName(e.target.value);
                  if (errors.hotelName) setErrors({ ...errors, hotelName: "" });
                }}
                className={`form-input ${errors.hotelName ? "error" : ""}`}
              />
              {errors.hotelName && <p className="error-text">{errors.hotelName}</p>}
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">City/Location *</label>
              <input
                type="text"
                placeholder="Enter city name"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors({ ...errors, location: "" });
                }}
                className={`form-input ${errors.location ? "error" : ""}`}
              />
              {errors.location && <p className="error-text">{errors.location}</p>}
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                placeholder="Enter full address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors({ ...errors, address: "" });
                }}
                className={`form-input ${errors.address ? "error" : ""}`}
              />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">Price per Night (₹) *</label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors({ ...errors, price: "" });
                }}
                className={`form-input ${errors.price ? "error" : ""}`}
              />
              {errors.price && <p className="error-text">{errors.price}</p>}
            </div>

            {/* Total Rooms */}
            <div className="form-group">
              <label className="form-label">Total Rooms *</label>
              <input
                type="number"
                placeholder="Enter number of rooms"
                value={totalRooms}
                onChange={(e) => {
                  setTotalRooms(e.target.value);
                  if (errors.totalRooms) setErrors({ ...errors, totalRooms: "" });
                }}
                className={`form-input ${errors.totalRooms ? "error" : ""}`}
              />
              {errors.totalRooms && <p className="error-text">{errors.totalRooms}</p>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                maxLength="10"
                placeholder="Enter 10-digit phone"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPhone(value);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                className={`form-input ${errors.phone ? "error" : ""}`}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            {/* Image URL */}
            <div className="form-group">
              <label className="form-label">Image URL *</label>
              <input
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  if (errors.image) setErrors({ ...errors, image: "" });
                }}
                className={`form-input ${errors.image ? "error" : ""}`}
              />
              {errors.image && <p className="error-text">{errors.image}</p>}
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label">Description *</label>
              <textarea
                placeholder="Enter hotel description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                className={`form-input ${errors.description ? "error" : ""}`}
                rows="4"
              />
              {errors.description && <p className="error-text">{errors.description}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn btn-primary btn-lg"
            >
              <FaPlus size={16} />
              {isEditing ? "Update Hotel" : "Add Hotel"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Hotels List */}
      <motion.div
        className="hotels-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2>Your Hotels ({myHotels.length})</h2>

        {loading ? (
          <LoadingSpinner />
        ) : myHotels.length === 0 ? (
          <motion.div
            className="empty-hotels"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaHotel size={48} />
            <p>No hotels added yet. Create your first hotel above!</p>
          </motion.div>
        ) : (
          <motion.div
            className="hotels-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {myHotels.map((hotel) => (
              <motion.div key={hotel._id} className="hotel-management-card" variants={itemVariants}>
                <div className="hotel-card-image">
                  <img src={hotel.image} alt={hotel.hotelName} />
                  <div className="hotel-overlay">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-icon btn-view"
                      title="View"
                    >
                      <FaEye size={18} />
                    </motion.button>
                  </div>
                </div>

                <div className="hotel-card-content">
                  <h3>{hotel.hotelName}</h3>
                  <p className="hotel-location">📍 {hotel.city}</p>
                  <p className="hotel-address">{hotel.address}</p>

                  <div className="hotel-stats">
                    <span className="stat-badge">
                      <FaDoorOpen size={12} /> {hotel.totalRooms} rooms
                    </span>
                    <span className="stat-badge available">
                      <FaCheckCircle size={12} /> {hotel.availableRooms} available
                    </span>
                  </div>

                  <p className="hotel-price">₹{hotel.price}/night</p>

                  <div className="hotel-card-actions">

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="btn btn-primary btn-sm"
  onClick={() => navigate("/agent-offers")}
  >
    Offers
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="btn btn-secondary btn-sm"
    onClick={() => handleEdit(hotel)}
  >
    <FaEdit size={14} />
    Edit
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="btn btn-danger btn-sm"
    onClick={() => handleDelete(hotel._id)}
  >
    <FaTrash size={14} />
    Delete
  </motion.button>

</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AgentDashboard;