import React from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  createBooking,
} from "../assets/services/bookingService";

import "./BookingPreview.css";

const BookingPreview = () => {
  const navigate =
    useNavigate();

  const pageLocation =
    useLocation();

  const {
    hotel,
    guests,
    rooms,
    startDate,
    endDate,
    totalAmount,
  } =
    pageLocation.state || {};

  const handleConfirmBooking =
  async () => {
    try {
      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      await createBooking({
        userId:
          user._id,

        hotelId:
          hotel._id,

        hotelName:
          hotel.hotelName,

        checkIn:
          startDate,

        checkOut:
          endDate,

        adults:
          guests.length,

        children: 0,

        rooms,

        guests,

        totalAmount,
      });

      alert(
        "Booking Successful 🎉"
      );

      navigate(
        "/MyBookings"
      );
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data
          ?.message ||
          "Booking Failed"
      );
    }
  };
  return (
    <div className="preview-container">

      <div className="preview-card">

        <h1>
          Booking Preview
        </h1>

        <div className="preview-section">
          <h2>
            Hotel Information
          </h2>

          <p>
            <strong>
              Hotel:
            </strong>{" "}
            {
              hotel.hotelName
            }
          </p>

          <p>
            <strong>
              Location:
            </strong>{" "}
            {hotel.city},{" "}
            {hotel.state}
          </p>

          <p>
            <strong>
              Price/Night:
            </strong>{" "}
            ₹
            {
              hotel.price
            }
          </p>
        </div>

        <div className="preview-section">
          <h2>
            Booking Information
          </h2>

          <p>
            <strong>
              Check In:
            </strong>{" "}
            {new Date(
              startDate
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>
              Check Out:
            </strong>{" "}
            {new Date(
              endDate
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>
              Rooms:
            </strong>{" "}
            {rooms}
          </p>

          <p>
            <strong>
              Guests:
            </strong>{" "}
            {
              guests.length
            }
          </p>

          <h3>
            Total Amount:
            ₹
            {
              totalAmount
            }
          </h3>
        </div>

        <div className="preview-section">
          <h2>
            Guest Details
          </h2>

          {guests.map(
            (
              guest,
              index
            ) => (
              <div
                key={
                  index
                }
                className="guest-preview"
              >
                <h4>
                  Guest{" "}
                  {index +
                    1}
                </h4>

                <p>
                  Name:
                  {" "}
                  {
                    guest.name
                  }
                </p>

                <p>
                  Age:
                  {" "}
                  {
                    guest.age
                  }
                </p>

                <p>
                  Gender:
                  {" "}
                  {
                    guest.gender
                  }
                </p>
              </div>
            )
          )}
        </div>

        <div className="preview-buttons">

          <button
            className="back-btn"
            onClick={() =>
              navigate(-1)
            }
          >
            Back
          </button>

          <button
            className="confirm-btn"
            onClick={
              handleConfirmBooking
            }
          >
            Confirm Booking
          </button>

        </div>

      </div>

    </div>
  );
};
export default BookingPreview;