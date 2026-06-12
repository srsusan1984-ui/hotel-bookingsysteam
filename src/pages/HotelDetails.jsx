import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import axios from "axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./HotelDetails.css";

const HotelDetails = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const pageLocation =
    useLocation();

  const searchData =
    pageLocation.state || {};

  const [hotel, setHotel] =
    useState(null);

  const [dateRange, setDateRange] =
    useState([
      searchData.startDate
        ? new Date(
            searchData.startDate
          )
        : null,

      searchData.endDate
        ? new Date(
            searchData.endDate
          )
        : null,
    ]);

  const [startDate, endDate] =
    dateRange;

  const [adults, setAdults] =
    useState(
      searchData.adults || 1
    );

  const [children, setChildren] =
    useState(
      searchData.children || 0
    );

  useEffect(() => {
    const fetchHotel =
      async () => {
        try {
          const response =
            await axios.get(
              `http://localhost:5000/api/hotels/${id}`
            );

          setHotel(
            response.data
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchHotel();
  }, [id]);

  const totalGuests =
    adults + children;

  const rooms =
    Math.max(
      1,
      Math.ceil(
        totalGuests / 2
      )
    );

  const handleBooking =
    () => {
      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      if (!user) {
        alert(
          "Please Login First"
        );

        navigate(
          "/Login"
        );

        return;
      }

      if (
        !startDate ||
        !endDate
      ) {
        alert(
          "Please select dates first"
        );

        return;
      }

      navigate(
        "/booking-details",
        {
          state: {
            hotel,
            startDate,
            endDate,
            adults,
            children,
            rooms,
          },
        }
      );
    };

  if (!hotel) {
    return (
      <h2>
        Loading...
      </h2>
    );
  }

  return (
    <div className="hotel-details">

      <img
        src={hotel.image}
        alt={hotel.hotelName}
        className="hotel-image"
      />

      <h1>
        {hotel.hotelName}
      </h1>

      <h3>
        📍 {hotel.city},
        {" "}
        {hotel.state}
      </h3>

      <p>
        📍 Address:
        {" "}
        {hotel.address}
      </p>

      <p>
        📞 Phone:
        {" "}
        {hotel.phone}
      </p>

      <p>
        💰 ₹
        {hotel.price}
        /night
      </p>

      <p>
        🏨 Total Rooms:
        {" "}
        {
          hotel.totalRooms
        }
      </p>
      <p>
  ✅ Available Rooms:
  {" "}
  {
    hotel.availableRooms
  }
</p> 

      <p>
        {hotel.description}
      </p>

      <div className="availability-box">

        <h2>
          Availability
        </h2>

        <DatePicker
          selectsRange
          startDate={
            startDate
          }
          endDate={
            endDate
          }
          onChange={(
            update
          ) =>
            setDateRange(
              update
            )
          }
          placeholderText="Check-In - Check-Out"
          className="availability-input"
        />

        <div className="guest-controls">

          <div>
            <label>
              Adults
            </label>

            <input
              type="number"
              min="1"
              value={
                adults
              }
              onChange={(
                e
              ) =>
                setAdults(
                  Number(
                    e
                      .target
                      .value
                  )
                )
              }
            />
          </div>

          <div>
            <label>
              Children
            </label>

            <input
              type="number"
              min="0"
              value={
                children
              }
              onChange={(
                e
              ) =>
                setChildren(
                  Number(
                    e
                      .target
                      .value
                  )
                )
              }
            />
          </div>

        </div>

        <h3>
          Rooms Required:
          {" "}
          {rooms}
        </h3>

        <button
          onClick={
            handleBooking
          }
        >
          Continue Booking
        </button>

      </div>

    </div>
  );
};

export default HotelDetails;