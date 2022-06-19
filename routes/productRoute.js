const express = require("express");
const router = express.Router();
const isAdminMiddleware = require("../middlewares/admin");
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");

router.post(
  "/",
  isAdminMiddleware,
  upload.fields([
    { name: "standardImg", maxCount: 8 },
    { name: "highlightImg", maxCount: 8 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  productController.createProduct
);

router.patch(
  "/:productId",
  isAdminMiddleware,
  upload.fields([
    { name: "standardImg", maxCount: 8 },
    { name: "highlightImg", maxCount: 8 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  productController.updateProduct
);

router.delete(
  "/:productId",
  isAdminMiddleware,
  productController.deleteProduct
);
router.delete(
  "/image/:imageId",
  isAdminMiddleware,
  productController.deleteImage
);
router.get("/", productController.getProducts);
router.get("/active", productController.getActiveProducts);
router.get("/:productId", productController.getProductById);
router.get("/active/:productId", productController.getActiveProductById);
router.get("/search/:category", productController.searchActiveProduct);
module.exports = router;
