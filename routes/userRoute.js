const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");

router.patch("/updateProfile", userController.updateProfile);
router.patch("/point", userController.updatePoint);
router.post(
  "/uploadProfileImage",
  upload.single("profileImage"),
  userController.uploadProfileImage
);
router.delete("/address", userController.deleteAddress);
router.delete("/creditCard", userController.deleteCreditCard);

router.get("/me", userController.getMe);

module.exports = router;
