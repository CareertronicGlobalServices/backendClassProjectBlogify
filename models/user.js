const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },

    profileImg: {
      type: String,
      default: "/profilepics/default.jpeg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("user not found");

    const salt = user.salt; //database
    const hashedPassword = user.password; //databse

    const userprovidedhash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    //return hashedPassword === userprovidedhash;
    if (hashedPassword !== userprovidedhash)
      throw new Error("Incorrect password");
    console.log(user);
    // return { ...user, password: undefined, salt: undefined };

    const token = createTokenForUser(user);
    return token;
  },
);

const USER = model("user", userSchema);

module.exports = USER;
