import React, { useState } from "react";
import "../App.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaCalendar,
  FaHeart,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBook,
  FaBars,
  FaTimes,
  FaStar,
} from "react-icons/fa";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const agentToken = localStorage.getItem("agentToken");

  const user = JSON.parse(localStorage.getItem("user"));
  const agent = JSON.parse(localStorage.getItem("agent"));

  const username = user?.name || "";
  const hotelName = agent?.hotelName || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("agentToken");
    localStorage.removeItem("agent");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkVariants = {
    hover: { y: -2, transition: { duration: 0.2 } },
  };

  return (
    <nav className="nav">
      <motion.div className="left-nav">
        {token ? (
          <>
            <Link
              to="/"
              className={isActive("/") ? "active" : ""}
              onClick={() => setIsMobileMenuOpen(false)}
              title="Home"
            >
              <FaHome size={18} />
              <span>Home</span>
            </Link>

            <Link
              to="/MyBookings"
              className={isActive("/MyBookings") ? "active" : ""}
              onClick={() => setIsMobileMenuOpen(false)}
              title="My Bookings"
            >
              <FaCalendar size={18} />
              <span>Bookings</span>
            </Link>

            <Link
              to="/favorites"
              className={isActive("/favorites") ? "active" : ""}
              onClick={() => setIsMobileMenuOpen(false)}
              title="Favorites"
            >
              <FaHeart size={18} />
              <span>Favorites</span>
            </Link>
          </>
        ) : agentToken ? (
          <>
            <Link
              to="/Agent-Dashboard"
              className={isActive("/Agent-Dashboard") ? "active" : ""}
              onClick={() => setIsMobileMenuOpen(false)}
              title="Dashboard"
            >
              <FaTachometerAlt size={18} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/Agent-Bookings"
              className={isActive("/Agent-Bookings") ? "active" : ""}
              onClick={() => setIsMobileMenuOpen(false)}
              title="Bookings"
            >
              <FaBook size={18} />
              <span>Bookings</span>
            </Link>

            {/* NEW REVIEWS BUTTON */}
            <Link
              to="/Agent-Reviews"
              className={isActive("/Agent/reviews") ? "active" : ""}
              onClick={() => setIsMobileMenuOpen(false)}
              title="Reviews"
            >
              <FaStar size={18} />
              <span>Reviews</span>
            </Link>
          </>
        ) : (
          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
            onClick={() => setIsMobileMenuOpen(false)}
            title="Home"
          >
            <FaHome size={18} />
            <span>Home</span>
          </Link>
        )}
      </motion.div>

      <div className="right-nav">
        {token ? (
          <div className="nav-user-section">
            <div>
              <div className="nav-user-name">{username}</div>
              <div className="nav-user-badge">Guest</div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt size={16} />
              <span>Logout</span>
            </motion.button>
          </div>
        ) : agentToken ? (
          <div className="nav-user-section">
            <div>
              <div className="nav-user-name">{hotelName}</div>
              <div className="nav-user-badge">Agent</div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt size={16} />
              <span>Logout</span>
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary"
            onClick={() => navigate("/Login")}
            title="Login"
          >
            Login
          </motion.button>
        )}
      </div>
    </nav>
  );
};

export default Nav;