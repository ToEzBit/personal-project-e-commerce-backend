const validator = require("validator");
const creatError = require("./creatError");
const { User } = require("../models");

module.exports = async (email, userName, password, confirmPassword) => {
  const errorObj = {};
  if (!email || !userName || !password) {
    errorObj.message = "email,username and password is require";
    errorObj.statusCode = 400;
    return errorObj;
  }
  if (password !== confirmPassword) {
    errorObj.message = "password and confirm password is not match";
    errorObj.statusCode = 400;
    return errorObj;
  }
  if (password.length < 6) {
    errorObj.message = "password must be at least 6 characters";
    errorObj.statusCode = 400;
    return errorObj;
  }
  if (!validator.isEmail(email)) {
    errorObj.message = "email is invalid";
    errorObj.statusCode = 400;
    return errorObj;
  }
  const existUserName = await User.findOne({
    where: { userName: userName },
  });
  if (existUserName) {
    errorObj.message = "username is already exist";
    errorObj.statusCode = 400;
    return errorObj;
  }
  const existEmail = await User.findOne({
    where: { email: email },
  });

  if (existEmail) {
    errorObj.message = "email is already exist";
    errorObj.statusCode = 400;
    return errorObj;
  }
};
