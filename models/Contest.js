import { Schema , models , model } from "mongoose";

const ContestSchema = new Schema({
    platform : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true,
    },
    questions : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Question'
        }
    ],
    contestDate : {
        type : String,
        required : true
    }
},{
    timestamps : true
})

ContestSchema.index({ platform : 1 , contestDate : -1 })

const Contest = models.Contest || model('Contest' , ContestSchema)

export default Contest