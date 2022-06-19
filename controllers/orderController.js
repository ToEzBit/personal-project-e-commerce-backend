const fs = require("fs");
const {
  Product,
  ProductImage,
  Order,
  OrderProduct,
  Address,
  User,
  sequelize,
} = require("../models");
const createError = require("../utils/createError");
const cloundinary = require("../utils/cloudinary");
const { Op } = require("sequelize");

exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.user;
    const { productId, amount } = req.body;

    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      createError("Product not found", 400);
    }

    const existOrder = await Order.findOne({
      where: {
        userId: id,
        status: "neworder",
      },
    });

    if (existOrder) {
      createError("You have an order in progress", 400);
    }
    const order = await Order.create(
      {
        userId: id,
        status: "neworder",
      },
      { transaction: t }
    );
    const orderProduct = await OrderProduct.create(
      {
        orderId: order.id,
        productId,
        amount,
        price: product.price,
      },
      { transaction: t }
    );

    order.totalPrice = product.price * amount;
    order.save();
    await t.commit();
    res.json({ order, orderProduct });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.addOrderProduct = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { productId, amount } = req.body;

    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      createError("Order not found", 400);
    }

    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      createError("Product not found", 400);
    }

    if (order.userId !== req.user.id) {
      createError("You are not the owner of this order", 400);
    }

    const existOrderProduct = await OrderProduct.findOne({
      where: {
        orderId,
        productId,
      },
    });

    if (existOrderProduct) {
      createError("This product is already in this order", 400);
    }

    const createdOrderProduct = await OrderProduct.create({
      orderId: order.id,
      productId,
      amount,
      price: product.price,
    });

    order.totalPrice += product.price * amount;
    await order.save();

    res.json({ order, createdOrderProduct });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrderProduct = async (req, res, next) => {
  try {
    const { orderProductId } = req.params;

    const orderProduct = await OrderProduct.findOne({
      where: { id: orderProductId },
    });
    if (!orderProduct) {
      createError("OrderProduct not found", 400);
    }
    const order = await Order.findOne({ where: { id: orderProduct.orderId } });
    if (!order) {
      createError("Order not found", 400);
    }
    order.totalPrice -= orderProduct.price * orderProduct.amount;
    await order.save();
    await orderProduct.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      createError("Order not found", 400);
    }

    const orderProducts = await OrderProduct.findAll({
      where: { orderId: order.id },
    });
    const orderProductId = [];
    orderProducts.map((el) => {
      orderProductId.push(el.id);
    });

    orderProductId.map(async (el) => {
      await OrderProduct.destroy({ where: { id: el } });
    });
    await order.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { id } = req.user;
    const orders = await Order.findAll({
      where: {
        userId: id,
        [Op.or]: [
          { status: "payment" },
          { status: "pending" },
          { status: "delivered" },
          { status: "succeed" },
          { status: "canceled" },
        ],
      },
      include: [
        {
          model: OrderProduct,
          attributes: {
            exclude: ["createdAt", "updatedAt", "productId", "orderId"],
          },
          include: [
            {
              model: Product,
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "mainDescription",
                  "subDescription1",
                  "subDescription2",
                  "status",
                ],
              },
              include: {
                model: ProductImage,
                where: {
                  role: "thumbnail",
                },
                attributes: {
                  exclude: ["createdAt", "updatedAt", "publicId", "productId"],
                },
              },
            },
          ],
        },
      ],
    });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderProduct,
          attributes: {
            exclude: ["createdAt", "updatedAt", "productId", "orderId"],
          },
          include: [
            {
              model: Product,
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "mainDescription",
                  "subDescription1",
                  "subDescription2",
                  "status",
                ],
              },
              include: {
                model: ProductImage,
                where: {
                  role: "thumbnail",
                },
                attributes: {
                  exclude: ["createdAt", "updatedAt", "publicId", "productId"],
                },
              },
            },
          ],
        },
      ],
    });

    if (!order) {
      createError("Order not found", 400);
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrdersByStatus = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { id } = req.user;
    const orders = await Order.findAll({
      where: {
        userId: id,
        status: status,
      },
      include: [
        {
          model: OrderProduct,
          attributes: {
            exclude: ["createdAt", "updatedAt", "productId", "orderId"],
          },
          include: [
            {
              model: Product,
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "mainDescription",
                  "subDescription1",
                  "subDescription2",
                  "status",
                ],
              },
              include: {
                model: ProductImage,
                where: {
                  role: "thumbnail",
                },
                attributes: {
                  exclude: ["createdAt", "updatedAt", "publicId", "productId"],
                },
              },
            },
          ],
        },
      ],
    });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderProduct = async (req, res, next) => {
  try {
    const { orderProductId } = req.params;
    const { action } = req.query;
    const orderProduct = await OrderProduct.findOne({
      where: { id: orderProductId },
    });
    if (!orderProduct) {
      createError("OrderProduct not found", 400);
    }
    if (!action) {
      createError("Action is require", 400);
    }
    const order = await Order.findOne({
      where: { id: orderProduct.orderId },
    });
    if (!order) {
      createError("Order not found", 400);
    }

    if (action === "increase") {
      orderProduct.amount++;
      order.totalPrice += orderProduct.price;
    }
    if (action === "decrease") {
      orderProduct.amount--;
      order.totalPrice -= orderProduct.price;
    }
    await orderProduct.save();
    await order.save();
    res.json({ order, orderProduct });
  } catch (err) {
    next(err);
  }
};

exports.checkoutOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { addressId } = req.body;
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderProduct,
          attributes: {
            exclude: ["createdAt", "updatedAt", "orderId"],
          },
        },
      ],
    });
    if (!order) {
      createError("Order not found", 400);
    }
    if (order.userId !== req.user.id) {
      createError("You are not the owner of this order", 400);
    }
    if (order.status === "checkout") {
      createError("Order already checked out", 400);
    }

    const address = await Address.findOne({
      where: { id: addressId },
    });

    if (!address) {
      createError("Address not found", 400);
    }

    const arrOrderProducts = JSON.parse(JSON.stringify(order.OrderProducts));

    const decreedStockArr = [];
    arrOrderProducts.map((el) => {
      const obj = {};
      obj.productId = el.productId;
      obj.amount = el.amount;
      decreedStockArr.push(obj);
    });

    for (let i = 0; i < decreedStockArr.length; i++) {
      const product = await Product.findOne({
        where: { id: decreedStockArr[i].productId },
      });
      if (product.stock < decreedStockArr[i].amount) {
        createError("Not enough stock", 400);
      }
    }

    decreedStockArr.map(async (el) => {
      const product = await Product.findOne({ where: { id: el.productId } });
      if (product.stock < el.amount) {
        createError(`${product.productName} Not enough stock `, 400);
      }
      product.stock -= el.amount;
      await product.save();
    });

    order.status = "checkout";
    order.addressId = addressId;
    await order.save();
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.checkoutOrderWithDiscount = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { addressId } = req.body;

    const { id } = req.user;
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderProduct,
          attributes: {
            exclude: ["createdAt", "updatedAt", "orderId"],
          },
        },
      ],
    });
    if (!order) {
      createError("Order not found", 400);
    }
    if (order.userId !== req.user.id) {
      createError("You are not the owner of this order", 400);
    }
    if (order.status === "checkout") {
      createError("Order already checked out", 400);
    }

    const address = await Address.findOne({
      where: { id: addressId },
    });

    if (!address) {
      createError("Address not found", 400);
    }

    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      createError("User not found", 400);
    }

    const arrOrderProducts = JSON.parse(JSON.stringify(order.OrderProducts));

    const decreedStockArr = [];
    arrOrderProducts.map((el) => {
      const obj = {};
      obj.productId = el.productId;
      obj.amount = el.amount;
      decreedStockArr.push(obj);
    });

    for (let i = 0; i < decreedStockArr.length; i++) {
      const product = await Product.findOne({
        where: { id: decreedStockArr[i].productId },
      });
      if (product.stock < decreedStockArr[i].amount) {
        createError("Not enough stock", 400);
      }
    }

    decreedStockArr.map(async (el) => {
      const product = await Product.findOne({ where: { id: el.productId } });
      if (product.stock < el.amount) {
        createError(`${product.productName} Not enough stock `, 400);
      }
      product.stock -= el.amount;
      await product.save();
    });

    order.status = "checkout";
    order.totalPrice -= user.point;
    order.discount = user.point;
    order.addressId = addressId;
    await order.save();

    user.point = 0;
    await user.save();
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.paymentOrder = async (req, res, next) => {
  try {
    if (!req.file) {
      createError("slip is require", 400);
    }
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: { id: orderId },
    });
    if (!order) {
      createError("Order not found", 400);
    }
    if (order.status !== "checkout") {
      createError("Order not checkout yet", 400);
    }
    if (order.userId !== req.user.id) {
      createError("You are not the owner of this order", 400);
    }

    const uploadedImage = await cloundinary.upload(req.file.path, {
      folder: "codecamp-e-commerce/payment-slip",
    });

    order.slip = uploadedImage.secure_url;
    order.slipPublicId = uploadedImage.public_id;
    order.status = "payment";
    await order.save();
    res.json({ order });
  } catch (err) {
    next(err);
  } finally {
    fs.unlinkSync(req.file.path);
  }
};
