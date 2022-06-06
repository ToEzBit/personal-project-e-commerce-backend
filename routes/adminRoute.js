const express = require("express");
const router = express.Router();
const isAdminMiddleware = require("../middlewares/admin");

const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);
router.get("/", isAdminMiddleware, adminController.getMe);
router.get("/users", isAdminMiddleware, adminController.getUsers);
router.get("/orders", isAdminMiddleware, adminController.getOrders);

module.exports = router;
