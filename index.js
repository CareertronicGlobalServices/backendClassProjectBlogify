const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const USER = require("./models/user");
const Blogs = require("./models/Blog");
const { connectMongoDB } = require("./connection");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const {
  checkforauthenticationcookie,
} = require("./middlewares/authentication");
//connection
connectMongoDB("mongodb://127.0.0.1:27017/blogify")
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkforauthenticationcookie("token"));
app.use(express.static(path.resolve("./public")));
app.use("/uploads", express.static(path.resolve("./public/uploads")));
//view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
  console.log(req.user);
  const allBlogs = await Blogs.find({});
  console.log(allBlogs);
  return res.render("Home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.listen(PORT, () => {
  console.log("Server Established");
});
