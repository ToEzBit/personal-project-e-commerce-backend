const bcrypt = require("bcryptjs");
const fs = require("fs");
const { User, Address, PhoneNumber, CreditCard } = require("../models");
const createError = require("../utils/createError");
const validateUpdateProfile = require("../utils/validateUpdateProfile");
const cropImage = require("../utils/cropImage");
const cloundinary = require("../utils/cloudinary");

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
      createError(validated.message, validated.statusCode);
    }

    const user = await User.findOne({ where: { id } });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.save();

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.lastUpdatePassword = new Date();
    }

    if (address) {
      const { province, district, postalCode, description, name } = address;
      const createdAddress = await Address.create({
        userId: id,
        province,
        district,
        postalCode,
        description,
        name,
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
    const {
      user: { id },
    } = req;

    if (!req.file) {
      createError("No file uploaded", 400);
    }

    const uploadedImage = await cloundinary.upload(req.file.path, {
      folder: "codecamp-e-commerce/userImage",
    });

    // const croppedImage = cropImage(uploadedImage.secure_url, 800, 800);

    const user = await User.findOne({ where: { id } });
    await cloundinary.destroy(user.profileImagePublicId);
    user.profileImage = uploadedImage.secure_url;
    user.profileImagePublicId = uploadedImage.public_id;
    await user.save();
    res.json({ newImage: uploadedImage.secure_url });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const {
      user: { id },
    } = req;
    const { addressId } = req.body;
    const address = await Address.findOne({ where: { id: addressId } });

    if (!address) {
      creatError("Address not found", 404);
    }

    if (id !== address.userId) {
      creatError("You dont have permission", 401);
    }

    await address.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.deleteCreditCard = async (req, res, next) => {
  try {
    const {
      user: { id },
    } = req;
    const { creditCardId } = req.body;
    const creditCard = await CreditCard.findOne({
      where: { id: creditCardId },
    });

    if (!creditCard) {
      createError("Credit card not found", 404);
    }

    if (id !== creditCard.userId) {
      creatError("You dont have permission", 401);
    }
    await creditCard.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const {
      user: { id },
    } = req;

    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["password", "lastUpdatePassword", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: Address,
          attributes: {
            exclude: ["userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: PhoneNumber,
          attributes: {
            exclude: ["userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: CreditCard,
          attributes: {
            exclude: ["userId", "createdAt", "updatedAt"],
          },
        },
      ],
    });
    res.json({ user });
  } catch (err) {}
};
