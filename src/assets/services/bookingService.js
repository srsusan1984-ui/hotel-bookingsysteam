export const createBooking = async (data) => {
  console.log("📤 Sending booking:", data);

  try {
    const response = await axios.post(API, data);
    console.log("✅ Booking Success:", response);
    return response;
  } catch (error) {
    console.error("❌ AXIOS ERROR");
    console.error(error);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    throw error;
  }
};