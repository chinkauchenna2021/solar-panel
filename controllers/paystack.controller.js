import crypto from "crypto";

const paystackWebhook = (req, res) => {
  try {
    // Generate signature from Paystack secret
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    // Verify Paystack signature
    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;

    // Handle event
    if (event.event === "charge.success") {
      const paymentRef = event.data.reference;
      const amount = event.data.amount / 100; // Paystack sends in kobo
      const customerEmail = event.data.customer.email;

      // TODO: Update your order in DB here (mark as paid)
      console.log("Payment successful:", paymentRef, amount, customerEmail);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
};
export  { paystackWebhook };
