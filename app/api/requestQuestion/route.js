import connectDB from "@/config/database";
import Question from "@/models/Question";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const POST = async (request) => {
  try {
    const session = await getSessionUser();
    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized", ok: false }),
        { status: 401 }
      );
    }

    const data = await request.json();
    const { questionId, handle } = data;

    if (!questionId || !handle) {
      return new Response(
        JSON.stringify({ message: "Fill all the fields", ok: false }),
        { status: 400 }
      );
    }

    if (session.username != handle) {
      return new Response(
        JSON.stringify({ message: "Unauthorized", ok: false }),
        { status: 401 }
      );
    }
    
    await connectDB()
    const question = await Question.findById(questionId);
    let user = await User.find({ username: handle });

    if (!question || !user || user.length != 1) {
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 400 }
      );
    }

    user = user[0];

    let reactions = user.reactions;
    let flag = 0;
    for (const reaction of reactions) {
      if (reaction._id.toString() == questionId.toString()) {
        flag = 1;
      }
    }
    let requested
    if (flag) {
      // Filter out the reaction and update the reactions array
      reactions = reactions.filter(
        (reaction) => reaction._id.toString() !== questionId.toString()
      );
      question.requestedBy = question.requestedBy - 1; // Decrement the net upvotes
      requested = false
    } else {
      reactions.push({ _id: questionId, value: 1 });
      question.requestedBy = question.requestedBy + 1;
      requested = true
    }

    user.reactions = reactions
    await user.save();
    await question.save();

    return new Response(
      JSON.stringify({
        message: "Successfully updated the request",
        ok: true,
        question,
        requested
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not request the question", ok: false }),
      { status: 500 }
    );
  }
};
