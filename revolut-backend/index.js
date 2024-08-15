const express = require("express");
const app = express();
const cors = require("cors");
const { default: axios } = require("axios");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.post("/order", async (req, res) => {
  try {
    const { amount, description, customer, billing_address } = req.body;

    const orderResponse = await axios.post(
      process.env.REVOLUT_API_URL,
      {
        amount: amount * 100,
        currency: "GBP",
        description,
        customer,
        billing_address,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Revolut-Api-Version": "2024-05-01",
          Authorization: `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
        },
      }
    );

    res.send(orderResponse.data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
