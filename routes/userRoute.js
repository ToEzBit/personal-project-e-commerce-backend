const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");

router.patch("/updateProfile", userController.updateProfile);
router.post(
  "/uploadProfileImage",
  upload.single("profileImage"),
  userController.uploadProfileImage
);
router.delete("/address", userController.deleteAddress);
router.delete("/creditCard", userController.deleteCreditCard);

module.exports = router;
