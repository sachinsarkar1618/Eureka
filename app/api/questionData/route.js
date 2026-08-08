import connectDB from "@/config/database";
import Contest from "@/models/Contest";
import Question from "@/models/Question";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const POST = async (request) => {
  try {
    const data = await request.json();
    const { questionId } = data;
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
    const contest = await Contest.findById(question.contest);

    const session = await getSessionUser();
    let requested = false;
    if (session && session.user) {
      const user = await User.findById(session.userId);
      let flag = 0;
      for (const reaction of user.reactions) {
        if (reaction._id.toString() == questionId.toString()) {
          flag = 1;
        }
      }
      if (flag) {
        requested = true;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Fetched the question data",
        ok: true,
        question,
        contestName: contest.title,
        requested,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not fetch question data", ok: false }),
      { status: 500 }
    );
  }
};
