const express = require("express");
const stripe = require("stripe")("your_stripe_secret_key"); // Replace with your Stripe Secret Key
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/create-checkout-session", async (req, res) => {
    try {
        const { amount, email } = req.body;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "PREMEO Order",
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:5500/success.html", // Redirect on successful payment
            cancel_url: "http://localhost:5500/cancel.html", // Redirect if payment is canceled
            customer_email: email,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));