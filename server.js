const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend files

// Configure mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oteniorodaniel5@gmail.com", // admin email
    pass: "YOUR_APP_PASSWORD" // use Gmail App Password
  }
});

app.post("/order", async (req, res) => {
  const { cart, email } = req.body;

  const orderDetails = cart.map(item => `${item.name} - ₦${item.price}`).join("\n");

  const mailOptionsAdmin = {
    from: "oteniorodaniel5@gmail.com",
    to: "oteniorodaniel5@gmail.com",
    subject: "New Order - Sunrise Multiventures",
    text: `New order received:\n\n${orderDetails}\n\nCustomer email: ${email}`
  };

  const mailOptionsCustomer = {
    from: "oteniorodaniel5@gmail.com",
    to: email,
    subject: "Order Confirmation - Sunrise Multiventures",
    text: `Thank you for your order!\n\nYou ordered:\n${orderDetails}\n\nWe will contact you shortly.`
  };

  try {
    await transporter.sendMail(mailOptionsAdmin);
    await transporter.sendMail(mailOptionsCustomer);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
