const express = require("express");
const router = express.Router();
const isAdminMiddleware = require("../middlewares/admin");

const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);
router.get("/", isAdminMiddleware, adminController.getMe);

module.exports = router;
