const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const createError = require("../utils/createError");
const {
  User,
  Order,
  OrderProduct,
  Product,
  ProductImage,
  PhoneNumber,
  Address,
} = require("../models");

const genToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ADMIN_SECRET_KEY, {});
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      createError("User not found", 404);
    }

    if (password !== admin.password) {
      createError("Password is incorrect", 401);
    }

    const token = genToken({ id: admin.id });
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { id } = req.admin;
    const admin = await Admin.findOne({
      where: { id },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!admin) {
      createError("Admin not found", 404);
    }
    res.json({ admin });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      attributes: [
        "id",
        "status",
        "totalPrice",
        "slip",
        "trackingNumber",
        "createdAt",
      ],
      include: [
        {
          model: Address,
          attributes: ["province", "district", "postalCode", "description"],
        },
        {
          model: User,
          attributes: ["id", "email", "username", "firstName", "lastName"],
          include: [
            {
              model: PhoneNumber,
              attributes: ["phoneNumber"],
            },
          ],
        },
        {
          model: OrderProduct,
          attributes: ["amount", "price"],
          include: [
            {
              model: Product,
              attributes: ["id", "productName", "role", "category"],
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

exports.getOrdersQuery = async (req, res, next) => {
  try {
    const { mode } = req.query;

    if (!mode) {
      createError("Mode is required", 400);
    }

    const orders = await Order.findAll({
      where: { status: mode },
      attributes: [
        "id",
        "status",
        "totalPrice",
        "slip",
        "trackingNumber",
        "createdAt",
      ],
      include: [
        {
          model: Address,
          attributes: ["province", "district", "postalCode", "description"],
        },
        {
          model: User,
          attributes: ["id", "email", "username", "firstName", "lastName"],
          include: [
            {
              model: PhoneNumber,
              attributes: ["phoneNumber"],
            },
          ],
        },
        {
          model: OrderProduct,
          attributes: ["amount", "price"],
          include: [
            {
              model: Product,
              attributes: ["id", "productName", "role", "category"],
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

exports.updateTracking = async (req, res, next) => {
  try {
    const { orderId, trackingNumber } = req.body;

    if (!orderId || !trackingNumber) {
      createError("Id and trackingNumber are required", 400);
    }

    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      createError("Order not found", 404);
    }

    if (order.status !== "payment") {
      createError("Order is not payment", 400);
    }

    order.trackingNumber = trackingNumber;
    await order.save();
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      createError("Id is required", 400);
    }

    const order = await Order.findOne({
      where: { id: orderId },
      include: {
        model: OrderProduct,
      },
    });

    if (!order) {
      createError("Order not found", 404);
    }

    if (order.status !== "checkout") {
      createError("Order is not checkout", 400);
    }

    const arrOrderProducts = JSON.parse(JSON.stringify(order.OrderProducts));

    const increasedStockArr = [];
    console.log(arrOrderProducts);
    arrOrderProducts.map((el) => {
      const obj = {};
      obj.productId = el.productId;
      obj.amount = el.amount;
      increasedStockArr.push(obj);
    });

    increasedStockArr.map(async (el) => {
      const product = await Product.findOne({
        where: { id: el.productId },
      });
      product.stock += el.amount;
      await product.save();
    });

    await OrderProduct.destroy({
      where: { orderId: orderId },
    });

    await order.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
