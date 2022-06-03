const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");

router.patch("/updateProfile", userController.updateProfile);
router.post(
  "/uploadProfileImage",
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  userController.uploadProfileImage
);
module.exports = router;
