import React, {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { FaHeart } from "react-icons/fa";

import {
  getHotels,
} from "../assets/services/hotelService";

import SearchBar from "./SearchBar";

import "../pages/Home.css";

const Home = () => {
  const navigate =
    useNavigate();

  const [hotels, setHotels] =
    useState([]);

  const [favorites, setFavorites] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "favorites"
        )
      ) || []
    );

  useEffect(() => {
    const fetchHotels =
      async () => {
        try {
          const response =
            await getHotels();

          setHotels(
            response.data
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchHotels();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(
        favorites
      )
    );
  }, [favorites]);

  const toggleFavorite =
    (hotel) => {
      const exists =
        favorites.find(
          (item) =>
            item._id ===
            hotel._id
        );

      if (exists) {
        setFavorites(
          favorites.filter(
            (item) =>
              item._id !==
              hotel._id
          )
        );
      } else {
        setFavorites([
          ...favorites,
          hotel,
        ]);
      }
    };

  return (
    <div className="home-container">

      <div className="hero-section">
        <h1>
          Find Your Perfect Hotel
        </h1>

        <p>
          Discover amazing
          places to stay at
          the best prices
        </p>
      </div>

      <SearchBar />

      <div className="featured-hotels">

        <h2>
          Featured Hotels
        </h2>

        <div className="hotel-grid">

          {hotels.map(
            (hotel) => (
              <div
                key={
                  hotel._id
                }
                className="hotel-card"
              >
                <FaHeart
                  className="heart-icon"
                  onClick={() =>
                    toggleFavorite(
                      hotel
                    )
                  }
                  style={{
                    color:
                      favorites.find(
                        (
                          item
                        ) =>
                          item._id ===
                          hotel._id
                      )
                        ? "red"
                        : "#94a3b8",
                  }}
                />

                <img
                  src={
                    hotel.image
                  }
                  alt={
                    hotel.hotelName
                  }
                />

                <h3>
                  {
                    hotel.hotelName
                  }
                </h3>

                <p>
                  {
                    hotel.city
                  }
                </p>

                <p>
                  ₹
                  {
                    hotel.price
                  }
                  /night
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/hotel/${hotel._id}`
                    )
                  }
                >
                  Book Now
                </button>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default Home;