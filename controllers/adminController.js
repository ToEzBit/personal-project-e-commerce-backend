const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const creatError = require("../utils/creatError");

const genToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ADMIN_SECRET_KEY, {});
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      creatError("User not found", 404);
    }

    if (password !== admin.password) {
      creatError("Password is incorrect", 401);
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
      creatError("Admin not found", 404);
    }
    res.json({ admin });
  } catch (err) {
    next(err);
  }
};
