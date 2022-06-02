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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      creatError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      creatError("Password is incorrect", 401);
    }

    const token = genToken({ id: user.id });

    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};
