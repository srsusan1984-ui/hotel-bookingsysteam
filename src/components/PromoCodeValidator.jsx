import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTag, FaCheck, FaTimes, FaGift } from "react-icons/fa";
import { validatePromoCode } from "../assets/services/offerService";
import { showSuccessToast, showErrorToast } from "../assets/utilities/toastUtils";
import OffersModal from "./OffersModal";

const PromoCodeValidator = ({ bookingAmount, hotelId, onApplyDiscount }) => {
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [discountDetails, setDiscountDetails] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);

  const handleValidate = async () => {
    if (!code.trim()) {
      showErrorToast("Please enter a promo code");
      return;
    }

    setLoading(true);
    try {
      const response = await validatePromoCode(code, bookingAmount, hotelId);

      if (response.success) {
        setAppliedOffer(response.offer);
        setDiscountDetails(response.discount);
        onApplyDiscount({
          code: response.offer.code,
          discountAmount: response.discount.amount,
          finalAmount: response.finalAmount,
        });
        showSuccessToast("Promo code applied successfully!");
      }
    } catch (error) {
      showErrorToast(error?.message || "Invalid promo code");
      setAppliedOffer(null);
      setDiscountDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOffer = (offerCode) => {
    setCode(offerCode);
    setShowOffersModal(false);
    // Auto-validate after selecting
    setTimeout(() => {
      handleValidateWithCode(offerCode);
    }, 200);
  };

  const handleValidateWithCode = async (promoCode) => {
    setLoading(true);
    try {
      const response = await validatePromoCode(promoCode, bookingAmount, hotelId);

      if (response.success) {
        setAppliedOffer(response.offer);
        setDiscountDetails(response.discount);
        setCode(promoCode);
        onApplyDiscount({
          code: response.offer.code,
          discountAmount: response.discount.amount,
          finalAmount: response.finalAmount,
        });
        showSuccessToast("Promo code applied successfully!");
      }
    } catch (error) {
      showErrorToast(error?.message || "Invalid promo code");
      setAppliedOffer(null);
      setDiscountDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setAppliedOffer(null);
    setDiscountDetails(null);
    onApplyDiscount(null);
  };

  if (appliedOffer && discountDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="text-3xl text-green-600"
            >
              <FaCheck />
            </motion.div>
            <div className="flex-1">
              <h4 className="font-bold text-green-900 text-lg mb-1">
                {appliedOffer.title}
              </h4>
              <p className="text-sm text-green-700 mb-3">
                {appliedOffer.description}
              </p>
              <div className="space-y-2 text-sm bg-white bg-opacity-50 rounded-lg p-3">
                <p className="text-green-800">
                  <span className="font-semibold">Code:</span>{" "}
                  <code className="font-mono font-bold text-green-900 tracking-widest">
                    {appliedOffer.code}
                  </code>
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">Discount:</span> ₹
                  {discountDetails.amount.toFixed(2)}
                </p>
                <p className="text-lg font-bold text-green-900 border-t border-green-200 pt-2 mt-2">
                  Total: ₹{(bookingAmount - discountDetails.amount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemove}
            className="p-2 text-green-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition"
          >
            <FaTimes size={24} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl text-blue-600"
          >
            <FaTag />
          </motion.div>
          <h4 className="font-bold text-gray-800 text-lg">Have a promo code?</h4>
        </div>

        <div className="space-y-4">
          {/* Input Section */}
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              disabled={loading}
              onKeyPress={(e) => e.key === "Enter" && handleValidate()}
              maxLength="20"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 uppercase font-semibold text-gray-900 placeholder-gray-500 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleValidate}
              disabled={loading || !code.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "..." : "Apply"}
            </motion.button>
          </div>

          {/* View Offers Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOffersModal(true)}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <FaGift className="group-hover:scale-110 transition-transform" />
            View All Active Offers
          </motion.button>

          <p className="text-xs text-gray-600 text-center font-semibold">
            💡 Click "View All Active Offers" to see available promo codes
          </p>
        </div>
      </motion.div>

      {/* Offers Modal */}
      <OffersModal
  isOpen={showOffersModal}
  onClose={() => setShowOffersModal(false)}
  onSelectOffer={handleSelectOffer}
  hotelId={hotelId}
/>
    </>
  );
};

export default PromoCodeValidator;
