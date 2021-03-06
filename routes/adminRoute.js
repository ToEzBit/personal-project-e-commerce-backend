const express = require("express");
const router = express.Router();
const isAdminMiddleware = require("../middlewares/admin");

const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);
router.get("/", isAdminMiddleware, adminController.getMe);
router.get("/users", isAdminMiddleware, adminController.getUsers);
router.get("/orders", isAdminMiddleware, adminController.getOrders);
router.get("/orders/query/", isAdminMiddleware, adminController.getOrdersQuery);
router.patch(
  "/confirm-payment/",
  isAdminMiddleware,
  adminController.confirmPayment
);
router.patch("/tracking", isAdminMiddleware, adminController.updateTracking);
router.patch(
  "/cancel-order/:orderId",
  isAdminMiddleware,
  adminController.cancelOrder
);

module.exports = router;
