import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getAgentHotels } from "../assets/services/hotelService";
import "./AgentReviews.css";
import {
  getHotelReviews,
  deleteReview,
} from "../assets/services/reviewService";

const AgentReviews = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] =
    useState(null);
  const [reviews, setReviews] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const agent = JSON.parse(
        localStorage.getItem("agent")
      );

      const response =
        await getAgentHotels(
          agent._id
        );

      setHotels(
        response.data || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadHotelReviews =
    async (hotel) => {
      try {
        setLoading(true);

        const response =
          await getHotelReviews(
            hotel._id
          );

        setSelectedHotel(
          hotel
        );

        setReviews(
          response.reviews || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleDelete =
    async (reviewId) => {
      try {
        await deleteReview(
          reviewId
        );

        setReviews(
          reviews.filter(
            (review) =>
              review._id !==
              reviewId
          )
        );

        alert(
          "Review deleted successfully"
        );
      } catch (error) {
        console.log(error);

        alert(
          "Failed to delete review"
        );
      }
    };

  if (loading) {
    return (
      <h2
        style={{
          padding: "20px",
        }}
      >
        Loading...
      </h2>
    );
  }

  return (
    <div className="agent-reviews-container">
      <h1>
        Review Moderation
      </h1>

      {!selectedHotel ? (
        <>
          <h2>
            My Hotels
          </h2>

         <div className="hotels-grid">
            {hotels.map(
              (hotel) => (
                <motion.div
                    className="hotel-card"
                  key={
                    hotel._id
                  }
                  whileHover={{
                    scale:
                      1.03,
                  }}
                  onClick={() =>
                    loadHotelReviews(
                      hotel
                    )
                  }
                  style={{
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "12px",
                    overflow:
                      "hidden",
                    cursor:
                      "pointer",
                    background:
                      "#fff",
                  }}
                >
                  <img className="hotel-image"
                    src={
                      hotel.image
                    }
                    alt={
                      hotel.hotelName
                    }
                    style={{
                      width:
                        "100%",
                      height:
                        "180px",
                      objectFit:
                        "cover",
                    }}
                  />

               <div className="hotel-info">
                    <h3>
                      {
                        hotel.hotelName
                      }
                    </h3>

                    <p>
                      {
                        hotel.city
                      }
                      ,
                      {
                        hotel.state
                      }
                    </p>

                    <p>
                      ₹
                      {
                        hotel.price
                      }
                      /night
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </>
      ) : (
        <>
          <button className="back-btn"
            onClick={() => {
              setSelectedHotel(
                null
              );

              setReviews(
                []
              );
            }}
            style={{
              marginBottom:
                "20px",
              padding:
                "10px",
            }}
          >
            ← Back To Hotels
          </button>

          <h2>
            {
              selectedHotel.hotelName
            }{" "}
            Reviews
          </h2>

          {reviews.length ===
          0 ? (
            <h3>
              No Reviews
              Found
            </h3>
          ) : (
            reviews.map(
              (review) => (
                <motion.div className="review-card"

            
                  key={
                    review._id
                  }
                  style={{
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "10px",
                    padding:
                      "15px",
                    marginBottom:
                      "15px",
                  }}
                >
                  <h3>
                    {
                      review.title
                    }
                  </h3>

                  <p>
                    ⭐
                    {
                      review.rating
                    }
                    /5
                  </p>

                  <p>
                    {
                      review.comment
                    }
                  </p>

                  <p>
                    <strong>
                      User:
                    </strong>{" "}
                    {
                      review.userName
                    }
                  </p>

                  <button className="delete-btn"
                    onClick={() =>
                      handleDelete(
                        review._id
                      )
                    }
                    style={{
                      background:
                        "red",
                      color:
                        "white",
                      border:
                        "none",
                      padding:
                        "10px 15px",
                      borderRadius:
                        "5px",
                      cursor:
                        "pointer",
                    }}
                  >
                    Delete Review
                  </button>
                </motion.div>
              )
            )
          )}
        </>
      )}
    </div>
  );
};

export default AgentReviews;