const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const createError = require("../utils/createError");
const {
  User,
  Order,
  OrderProduct,
  Product,
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
