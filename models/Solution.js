import { Schema, models, model } from "mongoose";

const SolutionSchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    questionName : {
      type : String,
      required : true,
    },
    acceptedCodeLink: {
      type: String,
    },
    additionalLinks : {
      type : String,
    },
    heading: {
      type: String,
      required: true,
    },
    solutionText: {
      type: String,
      required: true,
    },
    preRequisites : {
      type : String,
    },
    solutionHints: [
      {
        type: String,
      },
    ],
    netUpvotes: {
      type: Number,
      default: 0,
    },
    User: {
      type: String,
      required : true,
    },
    userPopularity : {
      type : Number,
      required : true
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    contestDate : {
      type : String,
      required : true
    },
    contestName : {
      type : String , 
      required : true
    },
    contest: {
      type: Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    }

  },
  {
    timestamps: true,
  }
);

SolutionSchema.index({ question : 1 })
SolutionSchema.index({ question : 1 , netUpvotes : -1 , createdAt : -1 })
SolutionSchema.index({ netUpvotes: -1 , createdAt : -1 })
SolutionSchema.index({ contestDate: -1 , netUpvotes: -1 , createdAt: -1 });
SolutionSchema.index({ updatedAt : -1 , contestDate: -1 , netUpvotes: -1 });

const Solution = models.Solution || model("Solution", SolutionSchema);

export default Solution;
