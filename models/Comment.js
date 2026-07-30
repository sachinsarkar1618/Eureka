import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new mongoose(
  {
    solution: {
      type: Schema.Types.ObjectId,
      ref: "Schema",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    netUpvotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

CommentSchema.index({ solution : 1 })

const Comment = models.Comment || model.export('Comment' , CommentSchema)

export default Comment