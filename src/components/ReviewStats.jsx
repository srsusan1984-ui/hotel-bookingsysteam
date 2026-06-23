import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const ReviewStats = ({ stats }) => {
  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={18}
          className={star <= rating ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );

  if (!stats) return null;

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 border-2 border-blue-200 mb-10 shadow-lg"
  >
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-[280px_1fr] gap-12 items-center">

        {/* Left Rating Card */}
        <div className="bg-white rounded-3xl shadow-md p-8 text-center">
          <div className="text-7xl font-black text-blue-600 mb-4">
            {Number(stats.averageRating).toFixed(1)}
          </div>

          <div className="flex justify-center mb-4">
            <StarRating rating={Math.round(stats.averageRating)} />
          </div>

          <p className="text-gray-600 font-semibold">
            Based on{" "}
            <span className="text-blue-600">
              {stats.totalReviews}
            </span>{" "}
            reviews
          </p>
        </div>

        {/* Right Breakdown */}
        <div>
          <h4 className="text-3xl font-black text-gray-900 mb-8">
            Rating Breakdown
          </h4>

          <div className="space-y-6">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star] || 0;

              const percentage =
                stats.totalReviews > 0
                  ? (count / stats.totalReviews) * 100
                  : 0;

              return (
                <div
                  key={star}
                  className="grid grid-cols-[50px_1fr_80px] items-center gap-4"
                >
                  {/* Star */}
                  <span className="font-bold text-gray-700">
                    {star}★
                  </span>

                  {/* Progress */}
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className={`h-full rounded-full ${
                        star === 5
                          ? "bg-green-500"
                          : star === 4
                          ? "bg-blue-500"
                          : star === 3
                          ? "bg-yellow-500"
                          : star === 2
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    />
                  </div>

                  {/* Count */}
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {count}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  </motion.div>
);
};

export default ReviewStats;