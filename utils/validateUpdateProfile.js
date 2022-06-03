const bcrypt = require("bcryptjs");
const validator = require("validator");
const { User } = require("../models");

module.exports = async (
  id,
  phoneNumber,
  creditCard,
  password,
  newPassword,
  confirmNewPassword,
  address
) => {
  const errorObj = {};
  if (!password) {
    errorObj.message = "password is require";
    errorObj.statusCode = 400;
    return errorObj;
  }

  const user = await User.findOne({ where: { id } });

  if (!user) {
    errorObj.message = "User not found";
    errorObj.statusCode = 404;
    return errorObj;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    errorObj.message = "Password is incorrect";
    errorObj.statusCode = 400;
    return errorObj;
  }

  if (phoneNumber) {
    if (!validator.isMobilePhone(phoneNumber, "th-TH")) {
      errorObj.message = "phoneNumber is invalid";
      errorObj.statusCode = 400;
      return errorObj;
    }
  }
  if (creditCard) {
    if (!validator.isCreditCard(creditCard)) {
      errorObj.message = "creditCard is invalid";
      errorObj.statusCode = 400;
      return errorObj;
    }
  }

  if (address) {
    if (address.postalCode.length < 5) {
      errorObj.message = "postalCode is invalid";
      errorObj.statusCode = 400;
      return errorObj;
    }
  }

  if (newPassword) {
    if (
      newPassword &&
      confirmNewPassword &&
      newPassword !== confirmNewPassword
    ) {
      errorObj.message = "newPassword and confirmNewPassword must be the same";
      errorObj.statusCode = 400;
      return errorObj;
    }

    if (newPassword.length < 6) {
      errorObj.message = "newPassword must be at least 6 characters";
      errorObj.statusCode = 400;
      return errorObj;
    }
  }
};
