import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const init = async () => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: "customer@email.com",
        amount: 50000,
        callback_url: "http://localhost:3000/cal",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

init();
