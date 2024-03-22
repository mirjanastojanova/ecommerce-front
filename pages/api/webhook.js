import { mongooseConnect } from "../../lib/mongoose";
import { buffer } from "micro";
import { Order } from "../../models/Order";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// added new path variable into Enviorment Variables, 
// stripe.exe which was in Downloads folder

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_15371cc5c453d5645c1178efb7e3054043a664ee552fd096276bae8a50152346";

const handler = async (req, res) => {
  await mongooseConnect();
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      const orderId = checkoutSessionCompleted.metadata.orderId;
      const paid = checkoutSessionCompleted.payment_status === "paid";
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).send("OK");
};

export const config = {
  api: { bodyParser: false },
};

export default handler;
