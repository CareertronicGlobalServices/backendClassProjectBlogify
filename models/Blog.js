const { Schema, model } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },

    CoverImg: {
      type: String,
      default: "/profilepics/default.jpeg",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

const Blog = model("blog", BlogSchema);

module.exports = Blog;
