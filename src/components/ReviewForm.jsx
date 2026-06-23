import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import { submitReview } from "../assets/services/reviewService";
import { showSuccessToast, showErrorToast } from "../assets/utilities/toastUtils";

const ReviewForm = ({ hotelId, hotelName, userId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.comment.trim()) {
      showErrorToast("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await submitReview({
        userId,
        hotelId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
      });

      if (response.success) {
        showSuccessToast("Review posted successfully!");
        setSubmitted(true);
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        setTimeout(() => {
          setFormData({ rating: 5, title: "", comment: "" });
          setSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      showErrorToast(error?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-8 text-center backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <FaCheckCircle className="text-5xl text-green-500" />
        </motion.div>
        <h3 className="text-2xl font-black text-green-900 mb-2">
          Thank you for your review!
        </h3>
        <p className="text-green-700 font-semibold">
          Your review has been posted and is now visible to other guests.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-10 border-2 border-gray-200 hover:border-blue-300 transition-all"
    >
      <div className="mb-8">
        <h3 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
          <FaPaperPlane className="text-blue-600" />
          Share Your Experience
        </h3>
        <p className="text-gray-600 font-semibold">
          Help other guests make informed decisions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <label className="block text-lg font-bold text-gray-900 mb-4">
            How would you rate your stay?
          </label>
          <div className="flex gap-4 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, rating: star }))
                }
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 transition-all"
              >
                <FaStar
                  size={40}
                  className={
                    star <= formData.rating
                      ? "text-yellow-400 drop-shadow-lg"
                      : "text-gray-300"
                  }
                />
              </motion.button>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-700 font-semibold">
              Rating: <span className="text-lg text-blue-600">{formData.rating}/5</span>
            </p>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Review Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Excellent location and friendly staff"
            maxLength="100"
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-gray-900 placeholder-gray-500 transition-all"
          />
          <p className="text-xs text-gray-600 mt-2">
            {formData.title.length}/100 characters
          </p>
        </motion.div>

        {/* Comment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Your Review
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Share your experience with other travelers... (Minimum 20 characters)"
            rows="6"
            minLength="20"
            maxLength="1000"
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-gray-900 placeholder-gray-500 resize-none transition-all"
          />
          <p className="text-xs text-gray-600 mt-2">
            {formData.comment.length}/1000 characters
          </p>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Post Your Review
            </>
          )}
        </motion.button>
      </form>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4"
      >
        <p className="text-sm text-blue-900 font-semibold">
          ✨ Your review will appear immediately and help other travelers make better decisions.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ReviewForm;
