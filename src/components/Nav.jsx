import React from "react";
import "../App.css";
import {
  Link,
  useNavigate,
} from "react-router-dom";

const Nav = () => {
  const navigate =
    useNavigate();

  const token =
    localStorage.getItem(
      "token"
    );

  const agentToken =
    localStorage.getItem(
      "agentToken"
    );

  const user = JSON.parse(
    localStorage.getItem(
      "user"
    )
  );

  const agent = JSON.parse(
    localStorage.getItem(
      "agent"
    )
  );

  const username =
    user?.name || "";

  const hotelName =
    agent?.hotelName || "";

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "agentToken"
    );

    localStorage.removeItem(
      "agent"
    );

    navigate("/");
  };

  return (
    <div className="nav">

      <div className="left-nav">

        {token ? (
          <>
            <Link to="/">
              Home
            </Link>

            <Link to="/MyBookings">
              My Bookings
            </Link>

            <Link to="/favorites">
              Favorites
            </Link>
          </>
        ) : agentToken ? (
          <>
            <Link to="/agent-dashboard">
              Dashboard
            </Link>

            <Link to="/agent-bookings">
              Bookings
            </Link>
          </>
        ) : (
          <>
            <Link to="/">
              Home
            </Link>
          </>
        )}

      </div>

      <div className="right-nav">

        {token ? (
          <>
            <span className="user-name">
              👤 {username}
            </span>

            <button
              onClick={
                handleLogout
              }
            >
              Logout
            </button>
          </>
        ) : agentToken ? (
          <>
            <span className="user-name">
              🏨 {hotelName}
            </span>

            <button
              onClick={
                handleLogout
              }
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/Login">
              <button>
                Login/Signup
              </button>
            </Link>

            <Link to="/Agent">
              <button>
                Agent Login/Signup
              </button>
            </Link>
          </>
        )}

      </div>

    </div>
  );
};

export default Nav;