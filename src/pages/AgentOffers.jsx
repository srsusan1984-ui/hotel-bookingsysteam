import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import {
  createOffer,
  getAllOffers,
  updateOffer,
  deactivateOffer,
   restoreOffer,
} from "../assets/services/offerService";

import { getAgentHotels } from "../assets/services/hotelService";

import {
  showSuccessToast,
  showErrorToast,
} from "../assets/utilities/toastUtils";

import "./AgentOffers.css";

const AgentOffers = () => {
  const [offers, setOffers] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [isEditing, setIsEditing] =
    useState(false);

  const [editingOfferId, setEditingOfferId] =
    useState(null);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minBookingAmount: "",
    validUntil: "",
    selectedHotel: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const agent = JSON.parse(
        localStorage.getItem("agent")
      );

      const hotelResponse =
        await getAgentHotels(agent._id);

      setHotels(hotelResponse.data || []);

     const offerResponse =
  await getAllOffers();

const agentHotelIds =
  hotelResponse.data.map(
    (hotel) =>
      hotel._id.toString()
  );

const filteredOffers =
  (offerResponse.offers || []).filter(
    (offer) =>
      offer.applicableHotels?.some(
        (hotel) =>
          agentHotelIds.includes(
            hotel._id
              ? hotel._id.toString()
              : hotel.toString()
          )
      )
  );

setOffers(filteredOffers);
    } catch (error) {
      console.log(error);
    }
  };
  const resetForm = () => {
    setFormData({
      title: "",
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minBookingAmount: "",
      validUntil: "",
      selectedHotel: "",
    });

    setIsEditing(false);
    setEditingOfferId(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleEditOffer = (
    offer
  ) => {
    setFormData({
      title: offer.title,
      code: offer.code,
      description:
        offer.description,
      discountType:
        offer.discountType,
      discountValue:
        offer.discountValue,
      minBookingAmount:
        offer.minBookingAmount || "",
      validUntil:
        offer.validUntil
          ?.split("T")[0] || "",
      selectedHotel:
        offer
          .applicableHotels?.[0]
          ?._id || "",
    });

    setEditingOfferId(
      offer._id
    );

    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

const handleDeleteOffer =
      async (offerId) => {
      const confirmDelete =
        window.confirm(
          "Delete this offer?"
        );

      if (!confirmDelete)
        return;

      try {
        await deactivateOffer(
          offerId
        );

        showSuccessToast(
          "Offer deleted successfully"
        );

        loadData();
      } catch (error) {
        console.log(error);

        showErrorToast(
          "Failed to delete offer"
        );
      }
    };
const handleRestore = async (id) => {
  try {
    await restoreOffer(id);

    showSuccessToast(
      "Offer restored successfully"
    );

    loadData();
  } catch (error) {
    showErrorToast(
      error?.message || "Restore failed"
    );
  }
};

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        if (isEditing) {
          await updateOffer(
            editingOfferId,
            {
              title:
                formData.title,
              description:
                formData.description,
              discountType:
                formData.discountType,
              discountValue:
                Number(
                  formData.discountValue
                ),
              minBookingAmount:
                Number(
                  formData.minBookingAmount
                ),
              validUntil:
                formData.validUntil,
              applicableHotels: [
                formData.selectedHotel,
              ],
            }
          );

          showSuccessToast(
            "Offer updated successfully"
          );
        } else {
          await createOffer({
            code: formData.code,
            title:
              formData.title,
            description:
              formData.description,
            discountType:
              formData.discountType,
            discountValue:
              Number(
                formData.discountValue
              ),
            minBookingAmount:
              Number(
                formData.minBookingAmount
              ),
            validFrom:
              new Date(),
            validUntil:
              formData.validUntil,
            applicableHotels: [
              formData.selectedHotel,
            ],
          });

          showSuccessToast(
            "Offer created successfully"
          );
        }

        resetForm();
        loadData();
      } catch (error) {
        console.log(error);

        showErrorToast(
          error?.message ||
            "Operation failed"
        );
      }
    };

  return (
    <div className="agent-offers-container">
      <motion.div
        className="offers-header"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
      >
        <h1>
          🎁 Hotel Offers
        </h1>

        <p>
          Create and manage
          promo codes
        </p>
      </motion.div>

      <div className="offers-grid">
        <div className="offer-form-card">
          <h2>
            {isEditing
              ? "Edit Offer"
              : "Create Offer"}
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <input
              name="title"
              placeholder="Offer Title"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              name="code"
              placeholder="Promo Code"
              value={
                formData.code
              }
              onChange={
                handleChange
              }
              disabled={
                isEditing
              }
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              required
            />

            <select
              name="discountType"
              value={
                formData.discountType
              }
              onChange={
                handleChange
              }
            >
              <option value="percentage">
                Percentage
              </option>

              <option value="fixed">
                Fixed Amount
              </option>
            </select>

            <input
              type="number"
              name="discountValue"
              placeholder="Discount Value"
              value={
                formData.discountValue
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="number"
              name="minBookingAmount"
              placeholder="Minimum Booking Amount"
              value={
                formData.minBookingAmount
              }
              onChange={
                handleChange
              }
            />

            <input
              type="date"
              name="validUntil"
              value={
                formData.validUntil
              }
              onChange={
                handleChange
              }
              required
            />

            <select
              name="selectedHotel"
              value={
                formData.selectedHotel
              }
              onChange={
                handleChange
              }
              required
            >
              <option value="">
                Select Hotel
              </option>

              {hotels.map(
                (
                  hotel
                ) => (
                  <option
                    key={
                      hotel._id
                    }
                    value={
                      hotel._id
                    }
                  >
                    {
                      hotel.hotelName
                    }
                  </option>
                )
              )}
            </select>

            <button
              type="submit"
              className="create-offer-btn"
            >
              <FaPlus />

              {isEditing
                ? " Update Offer"
                : " Create Offer"}
            </button>
          </form>
        </div>

        <div className="offers-list-card">
          <h2>
            Available Offers
          </h2>

          {offers.map(
            (offer) => (
              <div
                key={
                  offer._id
                }
                className="offer-item"
              >
                <div>
                  <h3>
                    {
                      offer.title
                    }
                  </h3>

                  <p>
                    {
                      offer.description
                    }
                  </p>

                  <span className="offer-code">
                    {
                      offer.code
                    }
                  </span>
                </div>

                <div>
                  <div className="discount-badge">
                    {offer.discountType ===
                    "percentage"
                      ? `${offer.discountValue}% OFF`
                      : `₹${offer.discountValue} OFF`}
                  </div>

                  <div className="offer-actions">
  {!offer.isActive ? (
    <button
      className="restore-btn"
      onClick={() =>
        handleRestore(offer._id)
      }
    >
      Restore
    </button>
  ) : (
    <>
      <button
        className="edit-btn"
        onClick={() =>
          handleEditOffer(offer)
        }
      >
        <FaEdit />
      </button>

      <button
        className="delete-btn"
        onClick={() =>
          handleDeleteOffer(
            offer._id
          )
        }
      >
        <FaTrash />
      </button>
    </>
  )}
</div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentOffers;