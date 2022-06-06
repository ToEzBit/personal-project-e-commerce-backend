const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.post("/:orderId", orderController.addOrderProduct);

module.exports = router;
