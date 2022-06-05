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

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { commentId } = req.params;
    const comment = await ProductComment.findOne({ where: { id: commentId } });

    if (!comment) {
      creatError("Comment not found", 400);
    }
    if (id !== comment.userId) {
      creatError("You have no permission", 400);
    }
    await comment.destroy();
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};
