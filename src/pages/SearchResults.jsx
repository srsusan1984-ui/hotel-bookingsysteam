import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  getHotels,
} from "../assets/services/hotelService";

import SearchBar from "./SearchBar";

import "./Home.css";

const SearchResults = () => {
  const navigate =
    useNavigate();

  const pageLocation =
    useLocation();

  const searchData =
    pageLocation.state || {};

  const rooms =
    searchData.rooms || 1;

  const [hotels, setHotels] =
    useState([]);

  const [maxPrice, setMaxPrice] =
    useState("");

  const [
    searchLocation,
  ] = useState(
    searchData.location || ""
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

  const filteredHotels =
    hotels.filter(
      (hotel) =>
        hotel.city
          .toLowerCase()
          .includes(
            searchLocation.toLowerCase()
          ) &&
        hotel.totalRooms >=
          rooms &&
        (maxPrice === "" ||
          hotel.price <=
            Number(maxPrice))
    );

  return (
    <div
      className="home-container"
    >
      <SearchBar
        initialLocation={
          searchData.location
        }
        initialStartDate={
          searchData.startDate
        }
        initialEndDate={
          searchData.endDate
        }
        initialAdults={
          searchData.adults
        }
        initialChildren={
          searchData.children
        }
        showPrice={true}
        maxPrice={maxPrice}
        setMaxPrice={
          setMaxPrice
        }
      />

      <div className="featured-hotels">
        <h2>
          Found{" "}
          {
            filteredHotels.length
          }{" "}
          Hotels
        </h2>

        <div className="hotel-grid">
          {filteredHotels.map(
            (hotel) => (
              <div
                key={
                  hotel._id
                }
                className="hotel-card"
              >
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
                <p>
            🛏 Available Rooms:
                {" "}
               {
                 hotel.availableRooms
                 }
                </p>

                <p>
                  Available
                  Rooms:
                  {" "}
                  {
                    hotel.totalRooms
                  }
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/hotel/${hotel._id}`,
                      {
                        state:
                          searchData,
                      }
                    )
                  }
                >
                  View Hotel
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;