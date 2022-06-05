const jwt = require("jsonwebtoken");

const createError = require("../utils/creatError");
const { Admin } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("Your are unauthorized", 401);
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      createError("Your are unauthorized", 401);
    }

    const payload = jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY);
    const admin = await Admin.findOne({
      where: { id: payload.id },
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      createError("Your are unauthorized", 401);
    }
    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};
