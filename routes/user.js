const { Router } = require("express");

const router = Router();
const USER = require("../models/user");

router.get("/signin", (req, res) => {
  return res.render("SignIn");
});
router.get("/signup", (req, res) => {
  return res.render("SignUp");
});

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  await USER.create({
    fullname,
    email,
    password,
  });

  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const token = await USER.matchPasswordAndGenerateToken(email, password);
    //console.log("USER", user);
    console.log(token);
    // return res.redire  ct("/");
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("SignIn", { error: "Incorrect Email /Pw" });
  }
});

router.get("/logout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});

module.exports = router;
