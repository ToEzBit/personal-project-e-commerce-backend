module.exports = (url, width, high) => {
  const crop = `w_${width},h_${high},c_crop`;
  const splitted = url.split("/");
  splitted.splice(6, 0, crop);
  const joined = splitted.join("/");
  return joined;
};
