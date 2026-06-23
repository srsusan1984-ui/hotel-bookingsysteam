import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaTag, FaCheck, FaCopy } from "react-icons/fa";
import { getActiveOffers } from "../assets/services/offerService";
import { showSuccessToast, showErrorToast } from "../assets/utilities/toastUtils";

const OffersModal = ({ isOpen, onClose, onSelectOffer,hotelId,}) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchOffers();
    }
  }, [isOpen]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await getActiveOffers();

const filteredOffers =
  (response.offers || []).filter(
    (offer) =>
      offer.applicableHotels?.length === 0 ||
      offer.applicableHotels?.some(
        (hotel) =>
          hotel._id === hotelId ||
          hotel === hotelId
      )
  );

setOffers(filteredOffers);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
      showErrorToast("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOffer = (offer) => {
    onSelectOffer(offer.code);
    showSuccessToast(`Promo code "${offer.code}" added!`);
    onClose();
  };

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showSuccessToast("Code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDiscountLabel = (offer) => {
    if (offer.discountType === "percentage") {
      return `${offer.discountValue}% OFF`;
    }
    return `₹${offer.discountValue} OFF`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between border-b border-blue-800">
              <div className="flex items-center gap-3">
                <FaTag className="text-white text-2xl" />
                <h2 className="text-2xl font-bold text-white">Active Offers</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-blue-500 rounded-lg transition text-white"
              >
                <FaTimes size={24} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-8 py-6">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : offers.length === 0 ? (
                <div className="text-center py-12">
                  <FaTag className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No active offers available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offers.map((offer, index) => (
                    <motion.div
                      key={offer._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSelectOffer(offer)}
                      className="group cursor-pointer bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all hover:scale-105"
                    >
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {getDiscountLabel(offer)}
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                          {offer.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {offer.description}
                        </p>

                        {/* Validity */}
                        <div className="text-xs text-gray-500 mb-2">
                          <p>Valid until: {new Date(offer.validUntil).toLocaleDateString()}</p>
                          {offer.minBookingAmount && (
                            <p>Min booking: ₹{offer.minBookingAmount}</p>
                          )}
                        </div>

                        {/* Usage */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Usage</span>
                            <span>{offer.currentUsage}/{offer.maxUsage}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition"
                              style={{
                                width: `${(offer.currentUsage / offer.maxUsage) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Code Section */}
                      <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between group-hover:bg-blue-50 transition">
                        <code className="text-lg font-bold text-gray-900 tracking-widest">
                          {offer.code}
                        </code>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleCopyCode(offer.code, e)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition"
                        >
                          {copiedCode === offer.code ? (
                            <FaCheck className="text-green-600" />
                          ) : (
                            <FaCopy className="text-gray-600" />
                          )}
                        </motion.button>
                      </div>

                      {/* Select Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
                      >
                        Use This Code
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OffersModal;
