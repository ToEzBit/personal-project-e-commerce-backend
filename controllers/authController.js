const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateSignup = require("../utils/validateSignup");
const creatError = require("../utils/creatError");
const { User } = require("../models");

const genToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { email, userName, password, confirmPassword } = req.body;
    const validated = await validateSignup(
      email,
      userName,
      password,
      confirmPassword
    );

    if (validated) {
      creatError(validated.message, validated.statusCode);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      userName,
      password: hashedPassword,
    });

    const token = genToken({ id: user.id });

    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};
