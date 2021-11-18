const cloudinary = require("cloudinary");
const { authCheck } = require("../util/authCheck");

const Upload = (req, res) => {
  authCheck((context = { req }));
  const files = req.files;
  let images = [];
  if (!files) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }
  files.forEach((file) => {
    images.push(file.path);
  });
  res.send(images);
};

const Delete = (req, res) => {
  authCheck((context = { req }));
  const temp = [];
  req.body.image.forEach((data) => {
    const split = data.name.split("/");
    temp.push("Asset/" + split[split.length - 1].split(".")[0]);
  });
  cloudinary.api.delete_resources(temp, (error, result) => {
    return res.json({ success: true, error, data: req.body.image });
  });
};

module.exports = {
  Upload,
  Delete,
};
