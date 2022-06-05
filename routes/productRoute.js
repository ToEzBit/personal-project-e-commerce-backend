const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");

router.post(
  "/",
  upload.fields([
    { name: "standardImg", maxCount: 8 },
    { name: "highlightImg", maxCount: 8 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  productController.createProduct
);

router.patch(
  "/:productId",
  upload.fields([
    { name: "standardImg", maxCount: 8 },
    { name: "highlightImg", maxCount: 8 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  productController.updateProduct
);

router.delete("/:productId", productController.deleteProduct);
router.delete("/image/:imageId", productController.deleteImage);
module.exports = router;
