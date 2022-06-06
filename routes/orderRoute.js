const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const upload = require("../middlewares/upload");

router.post("/", orderController.createOrder);
router.post("/:orderId", orderController.addOrderProduct);
router.delete("/deleteOrder/:orderId", orderController.deleteOrder);
router.delete("/:orderProductId", orderController.deleteOrderProduct);
router.get("/all", orderController.getAllOrders);
router.get("/:orderId", orderController.getOrderById);
router.patch("/checkout/:orderId", orderController.checkoutOrder);
router.patch(
  "/payment/:orderId",
  upload.single("slip"),
  orderController.paymentOrder
);

module.exports = router;
