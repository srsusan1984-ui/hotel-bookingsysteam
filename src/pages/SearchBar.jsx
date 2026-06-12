import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../pages/Home.css";

const SearchBar = ({
  initialLocation = "",
  initialStartDate = null,
  initialEndDate = null,
  initialAdults = 1,
  initialChildren = 0,
  showPrice = false,
  maxPrice = "",
  setMaxPrice = () => {},
}) => {
  const navigate =
    useNavigate();

  const [errors, setErrors] =
    useState({});

  const [location, setLocation] =
    useState(
      initialLocation
    );

  const [dateRange, setDateRange] =
    useState([
      initialStartDate,
      initialEndDate,
    ]);

  const [startDate, endDate] =
    dateRange;

  const [adults, setAdults] =
    useState(
      initialAdults
    );

  const [children, setChildren] =
    useState(
      initialChildren
    );

  const [showGuests, setShowGuests] =
    useState(false);

  const guestRef =
    useRef(null);

  const rooms = Math.ceil(
    adults / 2
  );

  useEffect(() => {
    const handleClickOutside =
      (event) => {
        if (
          guestRef.current &&
          !guestRef.current.contains(
            event.target
          )
        ) {
          setShowGuests(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSearch =
    () => {
      const newErrors = {};

      if (!location.trim()) {
        newErrors.location =
          true;
      }

      if (
        !startDate ||
        !endDate
      ) {
        newErrors.date = true;
      }

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
        "/search",
        {
          state: {
            location,
            startDate,
            endDate,
            adults,
            children,
            rooms,
          },
        }
      );
    };

  return (
    <div className="search-card">
      <div className="search-form">

        <div className="form-group">
          <label>
            Location
          </label>

          <input
            type="text"
            placeholder="City or hotel name"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            className={`form-input ${
              errors.location
                ? "error-input"
                : ""
            }`}
          />
        </div>

        <div className="form-group">
          <label>
            Check-In /
            Check-Out
          </label>

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
            dateFormat="EEE dd MMM"
            placeholderText="Check-In — Check-Out"
            monthsShown={2}
            className={`date-picker-input ${
              errors.date
                ? "error-input"
                : ""
            }`}
          />
        </div>

        <div
          className="form-group"
        >
          <label>
            Guests &
            Rooms
          </label>

          <div
            className="guest-container"
            ref={guestRef}
          >
            <div
              className="form-input guest-display"
              onClick={() =>
                setShowGuests(
                  !showGuests
                )
              }
            >
              {adults}
              {" "}Adults •{" "}
              {children}
              {" "}Children •{" "}
              {rooms}
              {" "}Room
            </div>

            {showGuests && (
              <div className="guest-popup">

                <div className="guest-row">
                  <span>
                    Adults
                  </span>

                  <div>
                    <button
                      onClick={() =>
                        adults >
                          1 &&
                        setAdults(
                          adults -
                            1
                        )
                      }
                    >
                      -
                    </button>

                    <span>
                      {adults}
                    </span>

                    <button
                      onClick={() =>
                        setAdults(
                          adults +
                            1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="guest-row">
                  <span>
                    Children
                  </span>

                  <div>
                    <button
                      onClick={() =>
                        children >
                          0 &&
                        setChildren(
                          children -
                            1
                        )
                      }
                    >
                      -
                    </button>

                    <span>
                      {children}
                    </span>

                    <button
                      onClick={() =>
                        setChildren(
                          children +
                            1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="rooms-display">
                  Rooms
                  Required:
                  {" "}
                  {rooms}
                </div>

                <button
                  className="done-btn"
                  onClick={() =>
                    setShowGuests(
                      false
                    )
                  }
                >
                  Done
                </button>

              </div>
            )}
          </div>
        </div>

        {showPrice && (
          <div className="form-group">
            <label>
              Max Price
            </label>

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(
                  e.target.value
                )
              }
              className="form-input"
            />
          </div>
        )}

        <button
          onClick={
            handleSearch
          }
          className="search-btn"
        >
          Search Hotels
        </button>

      </div>
    </div>
  );
};

export default SearchBar;