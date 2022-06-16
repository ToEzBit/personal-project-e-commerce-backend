const fs = require("fs");
const createError = require("../utils/createError");
const { User, Product, ProductImage, ProductComment } = require("../models");
const { Op } = require("sequelize");
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
      createError("Missing fields", 400);
    }

    const product = await Product.findOne({ where: { productName } });

    if (product) {
      createError("Product already exists", 400);
    }

    // const productName = "gundam wing";
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

    if (req.files.standardImg) {
      const { standardImg } = req.files;
      standardImg.map(async (el) => {
        const uploadStandardImage = await cloundinary.upload(el.path, {
          folder: `codecamp-e-commerce/product/${newProduct.id}`,
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

    if (req.files.highlightImg) {
      const { highlightImg } = req.files;
      highlightImg.map(async (el) => {
        const uploadHighlightImg = await cloundinary.upload(el.path, {
          folder: `codecamp-e-commerce/product/${newProduct.id}`,
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

    if (req.files.thumbnail) {
      const { thumbnail } = req.files;
      const uploadThumbnail = await cloundinary.upload(thumbnail[0].path, {
        folder: `codecamp-e-commerce/product/${newProduct.id}`,
      });
      const addThumbnail = await ProductImage.create({
        productId: newProduct.id,
        role: "thumbnail",
        image: uploadThumbnail.secure_url,
        publicId: uploadThumbnail.public_id,
      });
      await fs.unlinkSync(thumbnail[0].path);
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

    const { productId } = req.params;

    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      createError("Product not found", 404);
    }

    product.productName = productName || product.productName;
    product.stock = stock || product.stock;
    product.price = price || product.price;
    product.role = role || product.role;
    product.category = category || product.category;
    product.description = description || product.description;
    product.status = status || product.status;
    product.mainDescription = mainDescription || product.mainDescription;
    product.subDescription1 = subDescription1 || product.subDescription1;
    product.subDescription2 = subDescription2 || product.subDescription2;

    if (req.files) {
      if (req.files.standardImg) {
        const { standardImg } = req.files;
        standardImg.map(async (el) => {
          const uploadStandardImage = await cloundinary.upload(el.path, {
            folder: `codecamp-e-commerce/product/${product.id}`,
          });
          const addImage = await ProductImage.create({
            productId: product.id,
            role: "standard",
            image: uploadStandardImage.secure_url,
            publicId: uploadStandardImage.public_id,
          });
          await fs.unlinkSync(el.path);
        });
      }
      if (req.files.highlightImg) {
        const { highlightImg } = req.files;
        highlightImg.map(async (el) => {
          const uploadHighlightImg = await cloundinary.upload(el.path, {
            folder: `codecamp-e-commerce/product/${product.id}`,
          });
          const addImage = await ProductImage.create({
            productId: product.id,
            role: "highlight",
            image: uploadHighlightImg.secure_url,
            publicId: uploadHighlightImg.public_id,
          });
          await fs.unlinkSync(el.path);
        });
      }

      if (req.files.thumbnail) {
        const { thumbnail } = req.files;
        const uploadThumbnail = await cloundinary.upload(thumbnail[0].path, {
          folder: `codecamp-e-commerce/product/${product.id}`,
        });
        const addThumbnail = await ProductImage.create({
          productId: product.id,
          role: "thumbnail",
          image: uploadThumbnail.secure_url,
          publicId: uploadThumbnail.public_id,
        });
        await fs.unlinkSync(thumbnail[0].path);
      }
    }

    await product.save();
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      createError("Product not found", 404);
    }

    const productImg = await ProductImage.findAll({ where: { productId } });

    productImg.map(async (el) => {
      await cloundinary.destroy(el.publicId);
    });

    const destroyImgId = [];
    productImg.map(async (el) => {
      destroyImgId.push(el.id);
    });

    destroyImgId.map(async (el) => {
      await ProductImage.destroy({ where: { id: el } });
    });

    await product.destroy();
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const image = await ProductImage.findOne({ where: { id: imageId } });
    if (!image) {
      creatError("Image not found", 404);
    }

    await cloundinary.destroy(image.publicId);
    await image.destroy();
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    // const { page, limit } = req.query;
    // const offset = limit * (page - 1);
    // const products = await Product.findAll({
    //   offset,
    //   limit,
    //   order: [["id", "DESC"]],
    // });
    // res.json({ products });
    const products = await Product.findAll({
      attributes: {
        exclude: [
          "stock",
          "mainDescription",
          "subDescription1",
          "subDescription1",
          "subDescription1",
          "createdAt",
        ],
      },
      include: [
        {
          model: ProductImage,
          where: { role: "thumbnail" },
          attributes: ["image"],
        },
      ],
    });
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({
      where: { id: productId },
      attributes: {
        exclude: ["createdAt"],
      },
      include: [
        { model: ProductImage },
        {
          model: ProductComment,
          attributes: { exclude: ["updatedAt"] },
          include: [
            { model: User, attributes: ["id", "userName", "profileImage"] },
          ],
        },
      ],
    });

    res.json({ product });
    if (!product) {
      creatError("Product not found", 404);
    }
  } catch (err) {
    next(err);
  }
};

exports.searchProduct = async (req, res, next) => {
  try {
    const { search } = req.query;
    const products = await Product.findAll({
      where: { productName: { [Op.like]: `%${search}%` } },
      attributes: {
        exclude: [
          "stock",
          "mainDescription",
          "subDescription1",
          "subDescription1",
          "subDescription1",
          "createdAt",
        ],
      },
      include: [
        {
          model: ProductImage,
          where: { role: "thumbnail" },
          attributes: ["image"],
        },
      ],
    });

    res.json({ products });
  } catch (err) {
    next(err);
  }
};
