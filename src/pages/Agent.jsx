import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  agentLogin,
  agentSignup,
} from "../assets/services/authService";

import "./Auth.css";

const Agent = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] =
    useState(true);

  const [hotelName, setHotelName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [errors, setErrors] =
    useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const validateSignup =
    async (e) => {
      e.preventDefault();

      const newErrors = {};

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!hotelName.trim()) {
        newErrors.hotelName =
          "Hotel Name is required";
      }

      if (!email.trim()) {
        newErrors.email =
          "Email is required";
      } else if (
        !emailRegex.test(email)
      ) {
        newErrors.email =
          "Invalid Email Address";
      }

      if (!phone.trim()) {
        newErrors.phone =
          "Phone Number is required";
      }

      if (!password) {
        newErrors.password =
          "Password is required";
      } else if (
        !passwordRegex.test(password)
      ) {
        newErrors.password =
          "Password must contain uppercase, lowercase, number and symbol";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword =
          "Confirm Password is required";
      } else if (
        password !==
        confirmPassword
      ) {
        newErrors.confirmPassword =
          "Passwords do not match";
      }

      setErrors(newErrors);

      if (
        Object.keys(newErrors)
          .length > 0
      ) {
        return;
      }

      try {
        await agentSignup({
          hotelName,
          email,
          phone,
          password,
        });

        alert(
          "Agent Signup Successful"
        );

        setIsLogin(true);

        setHotelName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");

        setErrors({});
      } catch (error) {
        setErrors({
          email:
            error.response?.data
              ?.message ||
            "Signup Failed",
        });
      }
    };

  const handleLogin =
    async (e) => {
      e.preventDefault();

      const newErrors = {};

      if (!email.trim()) {
        newErrors.email =
          "Email is required";
      }

      if (!password.trim()) {
        newErrors.password =
          "Password is required";
      }

      setErrors(newErrors);

      if (
        Object.keys(newErrors)
          .length > 0
      ) {
        return;
      }

      try {
        const response =
          await agentLogin({
            email,
            password,
          });

        localStorage.setItem(
          "agentToken",
          response.data.token
        );

        localStorage.setItem(
          "agent",
          JSON.stringify(
            response.data.agent
          )
        );

        

         navigate(
           "/agent-dashboard"
           );
      } catch (error) {
        setErrors({
          email:
            error.response?.data
              ?.message ||
            "Login Failed",
        });
      }
    };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-tabs">
          <button
            className={
              isLogin
                ? "active"
                : ""
            }
            onClick={() =>
              setIsLogin(true)
            }
          >
            Login
          </button>

          <button
            className={
              !isLogin
                ? "active"
                : ""
            }
            onClick={() =>
              setIsLogin(false)
            }
          >
            Signup
          </button>
        </div>

        {isLogin ? (
          <form
            onSubmit={
              handleLogin
            }
          >
            <h2>
              Agent Login
            </h2>

            <input
              type="email"
              placeholder="Agent Email"
              value={email}
              className={
                errors.email
                  ? "error-input"
                  : ""
              }
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            {errors.email && (
              <p className="error-message">
                {errors.email}
              </p>
            )}

            <div className="password-wrapper">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                className={
                  errors.password
                    ? "error-input"
                    : ""
                }
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="show-password-btn"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="error-message">
                {errors.password}
              </p>
            )}

            <button
              type="submit"
              className="submit-btn"
            >
              Login
            </button>
          </form>
        ) : (
          <form
            onSubmit={
              validateSignup
            }
          >
            <h2>
              Agent Signup
            </h2>

            <input
              type="text"
              placeholder="Hotel Name"
              value={hotelName}
              className={
                errors.hotelName
                  ? "error-input"
                  : ""
              }
              onChange={(e) =>
                setHotelName(
                  e.target.value
                )
              }
            />

            {errors.hotelName && (
              <p className="error-message">
                {
                  errors.hotelName
                }
              </p>
            )}

            <input
              type="email"
              placeholder="Agent Email"
              value={email}
              className={
                errors.email
                  ? "error-input"
                  : ""
              }
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            {errors.email && (
              <p className="error-message">
                {errors.email}
              </p>
            )}
<input
  type="tel"
  maxLength="10"
  placeholder="Phone Number"
  value={phone}
  className={
    errors.phone
      ? "error-input"
      : ""
  }
  onChange={(e) => {
    const value =
      e.target.value.replace(
        /\D/g,
        ""
      );

    setPhone(value);
  }}
/>
            {errors.phone && (
              <p className="error-message">
                {errors.phone}
              </p>
            )}

            <div className="password-wrapper">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                className={
                  errors.password
                    ? "error-input"
                    : ""
                }
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="show-password-btn"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="error-message">
                {errors.password}
              </p>
            )}

            <div className="password-wrapper">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={
                  confirmPassword
                }
                className={
                  errors.confirmPassword
                    ? "error-input"
                    : ""
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="show-password-btn"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="error-message">
                {
                  errors.confirmPassword
                }
              </p>
            )}

            <button
            
              type="submit"
              className="submit-btn"
            >
              Signup
            </button>
          </form>
        )}
        
      </div>
    </div>
  );
};

export default Agent;