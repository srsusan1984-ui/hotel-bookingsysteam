import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaHotel, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { agentLogin, agentSignup } from "../assets/services/authService";
import { showSuccessToast, showErrorToast } from "../assets/utilities/toastUtils";
import "./Auth.css";

const Agent = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Signup state
  const [hotelName, setHotelName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!hotelName.trim()) newErrors.hotelName = "Hotel name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email address";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    else if (phone.length !== 10) newErrors.phone = "Phone must be 10 digits";
    if (!password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(password))
      newErrors.password = "Password must have uppercase, lowercase, number, and symbol (@$!%*?&) (8+ chars)";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await agentSignup({ hotelName, email, phone, password });
      showSuccessToast("Signup successful! Please login.");
      setIsLogin(true);
      setHotelName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await agentLogin({ email, password });
      localStorage.setItem("agentToken", response.data.token);
      localStorage.setItem("agent", JSON.stringify(response.data.agent));
      showSuccessToast("Login successful!");
      navigate("/agent-dashboard");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tabs */}
        <div className="auth-tabs">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(true);
              setErrors({});
            }}
          >
            Agent Login
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(false);
              setErrors({});
            }}
          >
            Register Hotel
          </motion.button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleLogin}
            className="auth-form"
          >
            <h2>Agent Portal</h2>
            <p className="form-subtitle">Sign in to your agent account</p>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                <FaEnvelope size={14} />
                Email Address
              </label>
              <input
                type="email"
                placeholder="agent@hotel.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`form-input ${errors.email ? "error" : ""}`}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">
                <FaLock size={14} />
                Password
              </label>
              <div className="password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`form-input ${errors.password ? "error" : ""}`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </motion.button>
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ marginTop: "24px" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>

            <p className="form-footer">
              Don't have an account?{" "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                className="link-btn"
                onClick={() => {
                  setIsLogin(false);
                  setErrors({});
                }}
              >
                Register here
              </motion.button>
            </p>
          </motion.form>
        ) : (
          /* Signup Form */
          <motion.form
            key="signup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={validateSignup}
            className="auth-form"
          >
            <h2>Register Your Hotel</h2>
            <p className="form-subtitle">Join our platform to manage bookings</p>

            {/* Hotel Name */}
            <div className="form-group">
              <label className="form-label">
                <FaHotel size={14} />
                Hotel Name
              </label>
              <input
                type="text"
                placeholder="Grand Hotel Ltd"
                value={hotelName}
                onChange={(e) => {
                  setHotelName(e.target.value);
                  if (errors.hotelName) setErrors({ ...errors, hotelName: "" });
                }}
                className={`form-input ${errors.hotelName ? "error" : ""}`}
              />
              {errors.hotelName && <p className="error-text">{errors.hotelName}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                <FaEnvelope size={14} />
                Email Address
              </label>
              <input
                type="email"
                placeholder="agent@hotel.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`form-input ${errors.email ? "error" : ""}`}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">
                <FaPhone size={14} />
                Phone Number
              </label>
              <input
                type="tel"
                maxLength="10"
                placeholder="9876543210"
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

            {/* Password */}
            <div className="form-group">
              <label className="form-label">
                <FaLock size={14} />
                Password
              </label>
              <div className="password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`form-input ${errors.password ? "error" : ""}`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </motion.button>
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">
                <FaLock size={14} />
                Confirm Password
              </label>
              <div className="password-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </motion.button>
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ marginTop: "24px" }}
            >
              {loading ? "Registering..." : "Register Hotel"}
            </motion.button>

            <p className="form-footer">
              Already registered?{" "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                className="link-btn"
                onClick={() => {
                  setIsLogin(true);
                  setErrors({});
                }}
              >
                Sign in
              </motion.button>
            </p>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default Agent;