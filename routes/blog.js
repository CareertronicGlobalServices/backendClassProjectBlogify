const { Router } = require("express");

const router = Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/Blog");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/\s+/g, "_"); // remove spaces
    const filename = `${Date.now()}-${cleanName}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/addblog", (req, res) => {
  return res.render("AddBlog", {
    user: req.user,
  });
});
router.post("/addblog", upload.single("CoverImg"), (req, res) => {
  // console.log(req.body);
  // console.log(req.file);

  const { title, body } = req.body;
  Blog.create({
    title,
    body,
    createdBy: req.user_id,
    CoverImg: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/`);
});

module.exports = router;
