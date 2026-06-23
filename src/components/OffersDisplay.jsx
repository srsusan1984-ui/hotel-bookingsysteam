import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTag, FaClock, FaCheck } from "react-icons/fa";
import { getActiveOffers } from "../assets/services/offerService";
import { showErrorToast } from "../assets/utilities/toastUtils";

const OffersDisplay = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await getActiveOffers();
        // Handle both array and object responses
        const offersArray = Array.isArray(data) ? data : (data.offers || []);
        setOffers(offersArray);
      } catch (error) {
        console.error("Failed to load offers:", error);
        showErrorToast("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading special offers...</p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No active offers at the moment</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        🎉 Special Offers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer, index) => (
          <motion.div
            key={offer._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white overflow-hidden group cursor-pointer hover:shadow-xl transition"
          >
            {/* Background decoration */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full" />

            <div className="relative z-10">
              {/* Discount Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                  <FaTag size={16} />
                  <span className="font-bold text-lg">
                    {offer.discountType === "percentage"
                      ? `${offer.discountValue}%`
                      : `₹${offer.discountValue}`}
                    OFF
                  </span>
                </div>
                <span className="text-xs bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1 font-semibold">
                  CODE: {offer.code}
                </span>
              </div>

              {/* Offer details */}
              <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
              <p className="text-blue-100 mb-6 text-sm">{offer.description}</p>

              {/* Conditions */}
              <div className="space-y-2 text-xs mb-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                {offer.minBookingAmount > 0 && (
                  <div className="flex items-center gap-2">
                    <FaCheck size={12} />
                    <span>Min booking: ₹{offer.minBookingAmount}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FaClock size={12} />
                  <span>
                    Valid until{" "}
                    {new Date(offer.validUntil).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {offer.maxUsageCount && (
                  <div className="flex items-center gap-2">
                    <span>
                      Limited: {offer.maxUsageCount - offer.usedCount} uses left
                    </span>
                  </div>
                )}
              </div>

              {/* Copy code button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.clipboard.writeText(offer.code);
                  alert(`Code ${offer.code} copied to clipboard!`);
                }}
                className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition"
              >
                Copy Code
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OffersDisplay;
