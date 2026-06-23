import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaUser, FaCheckCircle } from "react-icons/fa";
import { getHotelReviews, getReviewStats } from "../assets/services/reviewService";
import { showErrorToast } from "../assets/utilities/toastUtils";
import ReviewStats from "./ReviewStats";

const ReviewList = ({ hotelId, onReviewSubmitted }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await getHotelReviews(hotelId);
      const statsData = await getReviewStats(hotelId);

      setReviews(reviewsData.reviews || []);
      setStats(statsData.stats || null);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      showErrorToast("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  // Refresh reviews when a new one is submitted
  useEffect(() => {
    if (onReviewSubmitted) {
      fetchReviews();
    }
  }, [onReviewSubmitted]);

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={16}
          className={star <= rating ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8 w-full"
    >
      <motion.div
  style={{
    background: "red",
    height: "20px",
    width: "100%"
  }}
/>
      {/* Review Stats */}
      {stats && <ReviewStats stats={stats} />}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300"
        >
          <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-semibold mb-2">
            No reviews yet
          </p>
          <p className="text-gray-500">
            Be the first to share your experience at this hotel!
          </p>
        </motion.div>
      ) : (
       <div className="space-y-10 w-full">

          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-8"
          >
            <span>Guest Reviews</span>
            <span className="text-xl text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {reviews.length}
            </span>
          </motion.h3>

          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
            className="w-full bg-white rounded-2xl shadow-lg p-10 border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  {/* User Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                     <FaUser className="text-white text-2xl" />
                  </div>

                  {/* User Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 text-xl">
                        {review.userName || "Anonymous User"}
                      </h4>
                      {review.verified && (
                        <FaCheckCircle className="text-blue-600 text-sm" title="Verified Guest" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  <span className="font-bold text-gray-900 ml-2 bg-yellow-50 px-2 py-1 rounded-lg">
                    {review.rating}/5
                  </span>
                </div>
              </div>

              {/* Review Title */}
             <h5 className="font-bold text-2xl text-gray-900 mb-4 group-hover:text-blue-600 transition">
               {review.title}
             </h5>

              {/* Review Comment */}
              <p className="text-gray-700 leading-8 text-lg mb-6">
              {review.comment}
              </p>

              {/* Helpful Stats (Optional) */}
              {review.helpfulCount !== undefined && (
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 mt-6">
                  <button className="text-sm text-gray-600 hover:text-blue-600 font-semibold transition">
                    👍 {review.helpfulCount || 0} found helpful
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ReviewList;
