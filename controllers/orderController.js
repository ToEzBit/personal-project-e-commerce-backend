const { Product, Order, OrderProduct } = require("../models");
const createError = require("../utils/createError");
exports.createOrder = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId, amount } = req.body;

    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      createError("Product not found", 400);
    }
    const order = await Order.create({ userId: id, status: "pending" });
    const orderProduct = await OrderProduct.create({
      orderId: order.id,
      productId,
      amount,
      price: product.price * amount,
    });

    order.totalPrice = product.price * amount;
    order.save();
    res.json({ order, orderProduct });
  } catch (err) {
    next(err);
  }
};
