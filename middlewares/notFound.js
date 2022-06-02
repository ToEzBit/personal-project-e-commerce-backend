module.exports = (req, res) => {
  res.status(404).json({ message: "Resource Not Found On This Server" });
};
