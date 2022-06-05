const { Product, ProductComment } = require("../models");
const creatError = require("../utils/creatError");
exports.createComment = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { title, rate } = req.body;
    const { productId } = req.params;
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      creatError("Product not found", 400);
    }
    const createdComment = await ProductComment.create({
      userId: id,
      productId,
      title,
      rate,
    });
    res.json({ createdComment });
  } catch (err) {
    next(err);
  }
};
