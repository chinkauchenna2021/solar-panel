import axios from "axios";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

async function verifyPaystackPayment(reference) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Paystack verification error:", error.response?.data || error);
    throw new Error("Payment verification failed");
  }
}
export { verifyPaystackPayment };
