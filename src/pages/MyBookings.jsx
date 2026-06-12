import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getUserBookings,
  cancelBooking,
} from "../assets/services/bookingService";

import "./Pages.css";

const MyBookings = () => {
  const navigate =
    useNavigate();

  const [bookings, setBookings] =
    useState([]);

  useEffect(() => {
    const fetchBookings =
      async () => {
        try {
          const user =
            JSON.parse(
              localStorage.getItem(
                "user"
              )
            );

          if (!user) {
            navigate(
              "/Login"
            );
            return;
          }

          const response =
            await getUserBookings(
              user._id
            );

          setBookings(
            response.data
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchBookings();
  }, [navigate]);

  const handleCancel =
    async (
      bookingId
    ) => {
      try {
        await cancelBooking(
          bookingId
        );

        setBookings(
          bookings.map(
            (
              booking
            ) =>
              booking._id ===
              bookingId
                ? {
                    ...booking,
                    status:
                      "Cancelled",
                  }
                : booking
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="page">
      <h1>
        📅 My Bookings
      </h1>

      {bookings.length ===
      0 ? (
        <p>
          No Bookings Yet
        </p>
      ) : (
        bookings.map(
          (booking) => (
            <div
              key={
                booking._id
              }
              className="booking-card"
            >
              <h3>
                {
                  booking.hotelName
                }
              </h3>

              <p>
                💰 ₹
                {
                  booking.totalAmount
                }
              </p>

              <p>
                🗓️ Check-In:
                {" "}
                {new Date(
                  booking.checkIn
                ).toLocaleDateString()}
              </p>

              <p>
                🗓️ Check-Out:
                {" "}
                {new Date(
                  booking.checkOut
                ).toLocaleDateString()}
              </p>

              <p>
                🏨 Rooms:
                {" "}
                {
                  booking.rooms
                }
              </p>

              <p>
                👥 Guests:
                {" "}
                {booking
                  .guests
                  ?.length || 0}
              </p>

              <p>
                🛏️ Adults:
                {" "}
                {
                  booking.adults
                }
              </p>

              <p>
                👶 Children:
                {" "}
                {
                  booking.children
                }
              </p>

              <span
                className={`status-badge ${
                  booking.status ===
                  "Cancelled"
                    ? "status-cancelled"
                    : "status-confirmed"
                }`}
              >
                {booking.status ===
                "Cancelled"
                  ? "❌ Cancelled"
                  : "✅ Confirmed"}
              </span>

              {booking.status !==
                "Cancelled" && (
                <div
                  style={{
                    marginTop:
                      "15px",
                  }}
                >
                  <button
                    onClick={() =>
                      handleCancel(
                        booking._id
                      )
                    }
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          )
        )
      )}
    </div>
  );
};

export default MyBookings;