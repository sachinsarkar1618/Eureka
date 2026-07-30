import { Schema, models, model } from "mongoose";

const QuestionSchema = new Schema(
  {
    contest: {
      type: Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    questionLink: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    solutions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Solution",
      },
    ],
    requestedBy : {
        type : Number,
        default : 0
    },
    contestDate : {
      type : String,
      required : true
    },
    contestName : {
      type : String,
      required : true,
    }
  },
  {
    timestamps: true,
  }
);

QuestionSchema.index({ contest : 1 })
QuestionSchema.index({ contestDate : -1 })

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
