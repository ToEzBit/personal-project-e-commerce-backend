const fs = require("fs");
const creatError = require("../utils/creatError");
const { Product, ProductImage } = require("../models");
const cloundinary = require("../utils/cloudinary");
exports.createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      stock,
      price,
      role,
      category,
      description,
      status,
      mainDescription,
      subDescription1,
      subDescription2,
    } = req.body;

    if (
      !productName ||
      !stock ||
      !price ||
      !role ||
      !category ||
      !status ||
      !mainDescription
    ) {
      creatError("Missing fields", 400);
    }

    const product = await Product.findOne({ where: { productName } });

    if (product) {
      creatError("Product already exists", 400);
    }

    // const productName = "test status inactive";
    // const stock = 10;
    // const price = 100;
    // const role = "standard";
    // const category = "mega";
    // const status = "inactive";
    // const mainDescription = "test upload product + image";
    // const subDescription1 = null;
    // const subDescription2 = null;

    const newProduct = await Product.create({
      productName,
      stock,
      price,
      role,
      category,
      status,
      mainDescription,
      subDescription1,
      subDescription2,
    });

    if (req.files) {
      const { standardImg, highlightImg, thumbnail } = req.files;

      if (standardImg) {
        standardImg.map(async (el) => {
          const uploadStandardImage = await cloundinary.upload(el.path, {
            folder: `codecamp-e-commerce/product/${productName}`,
          });
          const addImage = await ProductImage.create({
            productId: newProduct.id,
            role: "standard",
            image: uploadStandardImage.secure_url,
            publicId: uploadStandardImage.public_id,
          });
          await fs.unlinkSync(el.path);
        });
      }

      if (highlightImg) {
        highlightImg.map(async (el) => {
          const uploadHighlightImg = await cloundinary.upload(el.path, {
            folder: `codecamp-e-commerce/product/${productName}`,
          });
          const addImage = await ProductImage.create({
            productId: newProduct.id,
            role: "highlight",
            image: uploadHighlightImg.secure_url,
            publicId: uploadHighlightImg.public_id,
          });
          await fs.unlinkSync(el.path);
        });
      }

      if (thumbnail) {
        const uploadThumbnail = await cloundinary.upload(thumbnail[0].path, {
          folder: `codecamp-e-commerce/product/${productName}`,
        });
        const addThumbnail = await ProductImage.create({
          productId: newProduct.id,
          role: "thumbnail",
          image: uploadThumbnail.secure_url,
          publicId: uploadThumbnail.public_id,
        });
        await fs.unlinkSync(thumbnail[0].path);
      }
    }

    res.json({ newProduct });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      productName,
      stock,
      price,
      role,
      category,
      description,
      status,
      mainDescription,
      subDescription1,
      subDescription2,
    } = req.body;

    if (req.files) {
      const { standardImg, highlightImg, thumbnail } = req.files;
    }

    const { productId } = req.params;

    console.log(productId);
  } catch (err) {
    next(err);
  }
};
