const util = require("util");
const cloudinary = require("cloudinary").v2;

exports.upload = util.promisify(cloudinary.uploader.upload);
exports.destroy = util.promisify(cloudinary.uploader.destroy);
