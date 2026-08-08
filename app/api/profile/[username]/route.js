import connectDB from "@/config/database";
import Solution from "@/models/Solution";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const GET = async (request, { params }) => {
  try {
    const { username } = params;
    const session = await getSessionUser();
    let reactions = [];

    if (!username) {
      return new Response(
        JSON.stringify({ message: "Fill all the fields", ok: false }),
        { status: 400 }
      );
    }
    await connectDB();
    let user = await User.find({ username });
    if (!user || user.length != 1) {
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 400 }
      );
    }
    user = user[0];
    if (session && session.username == username) {
      reactions = user.reactions;
    }
    let solutions = await Solution.find({ User: username })
      .sort({
        updatedAt: -1,
        contestDate: -1,
        netUpvotes: -1,
      })
      .lean(); // Convert Mongoose documents to plain JS objects


    for (let solution of solutions) {
      solution.question = {
        title: solution.questionName,
        _id : solution.question
      };
    }

    return new Response(
      JSON.stringify({
        message: "Fetched the user details successfully",
        ok: true,
        user,
        solutions,
        reactions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not fetch user data", ok: false }),
      { status: 500 }
    );
  }
};
