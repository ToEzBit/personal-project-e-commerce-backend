const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const createError = require("../utils/createError");

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
