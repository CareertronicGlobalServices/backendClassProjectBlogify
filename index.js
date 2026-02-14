const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const USER = require("./models/user");
const { connectMongoDB } = require("./connection");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
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

//view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  console.log(req.user);
  return res.render("Home", {
    user: req.user,
  });
});

app.use("/user", userRouter);
app.listen(PORT, () => {
  console.log("Server Established");
});
