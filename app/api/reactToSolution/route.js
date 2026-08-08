import Solution from "@/models/Solution";
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
    const { solutionId, value, handle } = data;

    if (!solutionId || !value || !handle || ![1, -1].includes(value)) {
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

    const solution = await Solution.findById(solutionId);
    let user = await User.find({ username: handle });
    if (!solution || !user || user.length != 1) {
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 400 }
      );
    }

    user = user[0];

    let author = await User.find({ username : solution.User })
    if(!author || author.length != 1){
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 400 }
      );
    }

    author = author[0]

    let reactions = user.reactions;

    let flag = 0,
      val;
    for (const reaction of reactions) {
      if (reaction._id.toString() === solutionId.toString()) {
        flag = 1; // Set flag if a matching reaction is found
        val = reaction.value;
      }
    }

    if (flag) {
      // Filter out the reaction and update the reactions array
      if (val == value) {
        reactions = reactions.filter(
          (reaction) => reaction._id.toString() !== solutionId.toString()
        );
        solution.netUpvotes = solution.netUpvotes - value;
        author.popularity = author.popularity - value
      } else {
        for (const reaction of reactions) {
          if (reaction._id == solutionId.toString()) {
            reaction.value = value;
          }
        }
        solution.netUpvotes = solution.netUpvotes + 2 * value;
        author.popularity = author.popularity + 2 * value
      }
    } else {
      reactions.push({ _id: solutionId, value });
      solution.netUpvotes = solution.netUpvotes + value;
      author.popularity = author.popularity + value
    }

    user.reactions = reactions;

    await user.save();
    await solution.save();
    await author.save()
    
    return new Response(
      JSON.stringify({
        message: "Successfully updated the reaction",
        ok: true,
        solution,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not update the reaction", ok: false }),
      { status: 500 }
    );
  }
};
