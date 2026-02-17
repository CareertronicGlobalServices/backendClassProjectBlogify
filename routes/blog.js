const { Router } = require("express");
const Comment = require("../models/comment");

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
    createdBy: req.user._id,
    CoverImg: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/`);
});

////---------------------------------
router.get("/myblogs", async (req, res) => {
  if (!req.user) return res.redirect("/user/signin");
  console.log(req.user);
  const myBlogs = await Blog.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });
  console.log(myBlogs);
  res.render("MyBlogs", {
    user: req.user,
    blogs: myBlogs,
  });
});
//--------------
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");

  const comments = await Comment.find({ blogId: req.params.id })
    .populate("createdBy")
    .sort({ createdAt: -1 });

  res.render("BlogDetails", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  if (!req.user) return res.redirect("/user/signin");

  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
