import React, {
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./BookingDetails.css";

const BookingDetails = () => {
  const navigate =
    useNavigate();

  const pageLocation =
    useLocation();

  const {
    hotel,
    startDate,
    endDate,
    adults,
    children,
  } =
    pageLocation.state || {};

  const totalGuests =
    (adults || 0) +
    (children || 0);

  const [guests, setGuests] =
    useState(
      Array.from(
        {
          length:
            totalGuests ||
            1,
        },
        () => ({
          name: "",
          age: "",
          gender:
            "Male",
        })
      )
    );

  const [errors, setErrors] =
    useState({});

  const addGuest =
    () => {
      setGuests([
        ...guests,
        {
          name: "",
          age: "",
          gender:
            "Male",
        },
      ]);
    };

  const removeGuest =
    (index) => {
      const updated =
        [...guests];

      updated.splice(
        index,
        1
      );

      setGuests(
        updated
      );
    };

  const handleChange =
    (
      index,
      field,
      value
    ) => {
      const updated =
        [...guests];

      updated[index][
        field
      ] = value;

      setGuests(
        updated
      );
    };

  const rooms =
    Math.ceil(
      guests.length / 2
    );

  const nights =
    startDate &&
    endDate
      ? Math.ceil(
          (
            new Date(
              endDate
            ) -
            new Date(
              startDate
            )
          ) /
            (
              1000 *
              60 *
              60 *
              24
            )
        )
      : 1;

  const totalAmount =
    nights *
    hotel.price *
    rooms;

  const handleContinue =
    () => {
      const newErrors =
        {};

      guests.forEach(
        (
          guest,
          index
        ) => {
          if (
            !guest.name.trim()
          ) {
            newErrors[
              `name-${index}`
            ] = true;
          }

          if (
            !guest.age
          ) {
            newErrors[
              `age-${index}`
            ] = true;
          }
        }
      );

      setErrors(
        newErrors
      );

      if (
        Object.keys(
          newErrors
        ).length > 0
      ) {
        return;
      }

      navigate(
        "/booking-preview",
        {
          state: {
            hotel,
            guests,
            rooms,
            startDate,
            endDate,
            totalAmount,
          },
        }
      );
    };

  return (
    <div className="booking-container">

      <div className="booking-card">

        <div className="guest-section">

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
                className="guest-card"
              >
                <div className="guest-title">
                  Guest{" "}
                  {index +
                    1}
                </div>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={
                    guest.name
                  }
                  onChange={(
                    e
                  ) =>
                    handleChange(
                      index,
                      "name",
                      e.target
                        .value
                    )
                  }
                  className={
                    errors[
                      `name-${index}`
                    ]
                      ? "error-input"
                      : ""
                  }
                />

                <input
                  type="number"
                  placeholder="Age"
                  value={
                    guest.age
                  }
                  onChange={(
                    e
                  ) =>
                    handleChange(
                      index,
                      "age",
                      e.target
                        .value
                    )
                  }
                  className={
                    errors[
                      `age-${index}`
                    ]
                      ? "error-input"
                      : ""
                  }
                />

                <select
                  value={
                    guest.gender
                  }
                  onChange={(
                    e
                  ) =>
                    handleChange(
                      index,
                      "gender",
                      e.target
                        .value
                    )
                  }
                >
                  <option>
                    Male
                  </option>

                  <option>
                    Female
                  </option>

                  <option>
                    Other
                  </option>
                </select>

                {guests.length >
                  1 && (
                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeGuest(
                        index
                      )
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            )
          )}

          <button
            className="add-btn"
            onClick={
              addGuest
            }
          >
            + Add Guest
          </button>
        </div>

        <div className="summary-section">

          <h2>
            Booking
            Summary
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
              Guests:
            </strong>{" "}
            {
              guests.length
            }
          </p>

          <p>
            <strong>
              Rooms:
            </strong>{" "}
            {rooms}
          </p>

          <p>
            <strong>
              Nights:
            </strong>{" "}
            {nights}
          </p>

          <h3>
            Total:
            ₹
            {
              totalAmount
            }
          </h3>

          <button
            className="continue-btn"
            onClick={
              handleContinue
            }
          >
            Continue
          </button>

        </div>

      </div>

    </div>
  );
};

export default BookingDetails;