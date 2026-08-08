import connectDB from "@/config/database";
import Question from "@/models/Question";
import Solution from "@/models/Solution";
import UserModel from "@/models/User"
import { compressToBase64 } from "lz-string";

export const POST = async (request , { params }) => {
  try {
    const { questionId } = params
    
    if (!questionId) {
      return new Response(
        JSON.stringify({ message: "Fill all the fields", ok: false }),
        { status: 400 }
      );
    }

    await connectDB();
    const question = await Question.findById(questionId);
    if (!question) {
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 400 }
      );
    }

    const data = await request.json();
    let {
      User,
      heading,
      solutionHints,
      solutionText,
      additionalLinks,
      acceptedCodeLink,
      preRequisites
    } = data;
    User = User || "Anonymous";

    if (!heading || solutionHints.length > 5 || !solutionText) {
      return new Response(
        JSON.stringify({ message: "Fill all the fields", ok: false }),
        { status: 400 }
      );
    }

    let user
    if(User != 'Anonymous'){
      user = await UserModel.find({ username : User })
      if(!user || user.length != 1){
        return new Response(JSON.stringify({ message : 'Incorrect input' , ok : false}) , { status : 400 })
      }
      user = user[0]
    }
    
    const solution = new Solution({
      User , 
      question : question._id,
      questionName : question.title,
      heading ,
      solutionText : compressToBase64(solutionText),
      solutionHints,
      acceptedCodeLink,
      additionalLinks,
      preRequisites,
      userPopularity : User == "Anonymous" ? 0 : user.popularity,
      contestDate : question.contestDate,
      contestName : question.contestName,
      contest : question.contest,
    })

    await solution.save()

    question.solutions.push(solution._id)

    await question.save()

    return new Response(JSON.stringify({ message : 'Added the solution successfully' , ok : true }) , { status : 200 })

  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not add solution", ok: false }),
      { status: 500 }
    );
  }
};
