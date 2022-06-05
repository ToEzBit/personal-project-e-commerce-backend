const { Product } = require("../models");
const createError = require("../utils/createError");
exports.createOrder = async (req, res, next) => {
  try {
    const { productId, amount } = req.body;

    const product = await Product.findOne({ id: productId });
    if (!product) {
      createError(400, "Product not found");
    }
  } catch (err) {
    next(err);
  }
};
