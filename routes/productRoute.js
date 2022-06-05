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

router.delete("/:productId", productController.deleteProduct);
router.delete("/image/:imageId", productController.deleteImage);
router.get("/", productController.getProducts);
router.get("/search", productController.searchProduct);
router.get("/:productId", productController.getProductById);
module.exports = router;
