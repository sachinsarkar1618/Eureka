import connectDB from "@/config/database";
import Question from "@/models/Question";
import Solution from "@/models/Solution";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { decompressFromBase64 } from "lz-string";

export const POST = async (request) => {
  try {
    const data = await request.json();
    const { questionId, solutionId, size, handle , pageNo } = data;
    const actualSize = size || 3;

    await connectDB();

    let reactions = [];

    if (handle) {
      let user = await User.find({ username: handle });
      const session = await getSessionUser();
      if (session.username != handle) {
        return new Response(
          JSON.stringify({
            message: "Unauthorized",
            ok: false,
          }),
          { status: 401 }
        );
      }
      if (user.length != 1) {
        return new Response(
          JSON.stringify({ message: "Incorrect input", ok: false }),
          { status: 400 }
        );
      }
      reactions = user[0].reactions;
    }

    if (questionId) {
      const question = await Question.findById(questionId);
      if (!question) {
        return new Response(
          JSON.stringify({ message: "Incorrect input", ok: false }),
          { status: 400 }
        );
      }
      const solutions = await Solution.find({ question: questionId })
        .sort({ netUpvotes: -1 , createdAt : -1 })
        .limit(actualSize);

      return new Response(
        JSON.stringify({
          message: "Solutions fetched successfully",
          ok: true,
          solutions,
          reactions,
        }),
        { status: 200 }
      );
    } else if (solutionId) {
      const solution = await Solution.findById(solutionId);
      if (!solution) {
        return new Response(
          JSON.stringify({ message: "Incorrect input", ok: false }),
          { status: 400 }
        );
      }
      solution.solutionText = decompressFromBase64(solution.solutionText)
      const questionName = await Question.findById(solution.question).then(
        (doc) => doc.title
      );
      return new Response(
        JSON.stringify({
          message: "Fetched the solution successfully",
          ok: true,
          solution,
          questionName,
          reactions,
        }),
        { status: 200 }
      );
    }
    else if(pageNo){
      const solutions = await Solution.find()
      .sort({ contestDate: -1 , netUpvotes: -1 , createdAt : -1 })
      .populate("question")
      .skip((pageNo - 1) * 10)
      .limit(actualSize);

      return new Response(
        JSON.stringify({
          message: "Solutions fetched successfully",
          ok: true,
          solutions,
          reactions,
          lastPage : (await Solution.estimatedDocumentCount() == (pageNo - 1) * actualSize + solutions.length)
        }),
        { status: 200 }
      );
    }

    const solutions = await Solution.find()
      .sort({ contestDate: -1 , netUpvotes: -1 , createdAt : -1 })
      .populate("question")
      .limit(actualSize);

    return new Response(
      JSON.stringify({
        message: "Solutions fetched successfully",
        ok: true,
        solutions,
        reactions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not fetch solutions", ok: false }),
      { status: 500 }
    );
  }
};
