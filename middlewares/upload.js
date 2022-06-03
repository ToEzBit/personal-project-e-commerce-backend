const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb("Error", "public/images")
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});

module.exports = multer({ storage });
