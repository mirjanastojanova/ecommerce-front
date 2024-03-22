import { mongooseConnect } from "../../lib/mongoose";
import { Order } from "../../models/Order";
import { Product } from "../../models/Product";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handle = async (req, res) => {
  await mongooseConnect();
  if (req.method !== "POST") {
    res.json("Should be a POST request");
    return;
  }
  const {
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    cartProducts,
  } = req.body;
  const productsIds = cartProducts;
  // Set holds only unique values, values that occur once
  const uniqueIds = [...new Set(productsIds)];
  // _id is from the model, if _id is in the uniqueIds
  // productsInfos stores every product
  const productsInfos = await Product.find({ _id: uniqueIds });

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(
      (p) => p._id.toString() == productId
    );
    const quantity = productsIds.filter((id) => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      const productPrice = productInfo.price; // Price of the product
      line_items.push({
        quantity,
        price_data: {
          currency: "USD",
          product_data: { name: productInfo.title },
          unit_amount: productPrice * 100,
        },
      });
    }
  }

  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    paid: false,
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    customer_email: email,
    success_url: process.env.PUBLIC_URL + "/cart?success=true",
    cancel_url: process.env.PUBLIC_URL + "/cart?canceled=true",
    metadata: { orderId: orderDoc._id.toString() },
  });

  res.json({ url: session.url });
};

export default handle;
