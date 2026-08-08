import connectDB from "@/config/database";
import Contest from "@/models/Contest";

export const POST = async (request) => {
  try {
    const data = await request.json();
    const { platform } = data;

    // Basic validation
    if (!platform || !['codeforces', 'codechef', 'leetcode'].includes(platform)) {
      return new Response(
        JSON.stringify({ message: 'Incorrect input', ok: false }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Fetch contests for the selected platform
    const contests = await Contest.find({ platform }).sort({ contestDate : -1 });

    // Prepare an array of contest objects
    const contestArr = contests.map((contest) => ({
      value: contest._id,
      label: contest.title,
      contestDate : contest.contestDate
    }));

    // Send response with the fetched contests
    return new Response(
      JSON.stringify({
        message: 'Successfully fetched the contests',
        ok: true,
        contestArr
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Could not fetch contests', ok: false }),
      { status: 500 }
    );
  }
};
