const bcrypt = require("bcryptjs");
const { User, Address, PhoneNumber, CreditCard } = require("../models");
const creatError = require("../utils/creatError");
const validateUpdateProfile = require("../utils/validateUpdateProfile");

exports.updateProfile = async (req, res, next) => {
  try {
    const {
      user: { id },
    } = req;

    const {
      firstName,
      lastName,
      phoneNumber,
      creditCard,
      address,
      password,
      newPassword,
      confirmNewPassword,
    } = req.body;

    const validated = await validateUpdateProfile(
      id,
      phoneNumber,
      creditCard,
      password,
      newPassword,
      confirmNewPassword,
      address
    );

    if (validated) {
      creatError(validated.message, validated.statusCode);
    }

    const user = await User.findOne({ where: { id } });

    user.firstName = firstName;
    user.lastName = lastName;
    user.save();

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.lastUpdatePassword = new Date();
    }

    if (address) {
      const { province, district, postalCode, description } = address;
      const createdAddress = await Address.create({
        userId: id,
        province,
        district,
        postalCode,
        description,
      });
      res.json({ address: createdAddress });
      return;
    }

    if (phoneNumber) {
      const createPhoneNumber = await PhoneNumber.create({
        userId: id,
        phoneNumber: phoneNumber,
      });
      res.json({ phoneNumber: createPhoneNumber });
      return;
    }

    if (creditCard) {
      console.log(creditCard);
      const createdCreditCard = await CreditCard.create({
        userId: id,
        creditCard: creditCard,
      });
      res.json({ creditCard: createdCreditCard });
      return;
    }

    res.json({ user: user });
  } catch (err) {
    next(err);
  }
};

exports.uploadProfileImage = async (req, res, next) => {
  try {
    // const { profileImage } = req.files;
    // console.log(req.files);
    // console.log(profileImage);
  } catch (err) {
    next(err);
  }
};
