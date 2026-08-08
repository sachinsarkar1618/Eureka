import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const POST = async (request) => {
  try {
    const session = await getSessionUser();
    const data = await request.json();
    const { email, username } = data;
    if (!session || session.user?.email != email) {
      return new Response(
        JSON.stringify({
          message: "Unauthorized",
          ok: false,
        }),
        { status: 401 }
      );
    }
    if (session.username) {
      return new Response(
        JSON.stringify({ message: "The user already has an username", ok: false }),
        { status: 400 }
      );
    }
    let user = await User.find({ email });
    if (!user || user.length != 1) {
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 400 }
      );
    }
    user = user[0];

    const allUsers = await User.find({});
    const filtered_user = allUsers.filter((user) => user.username == username);
    if (filtered_user.length != 0) {
      return new Response(
        JSON.stringify({ message: "This username has already been taken up, please try another", ok: false }),
        { status: 400 }
      );
    }
    user.username = username
    await user.save()
    return new Response(JSON.stringify({ message : 'Set the username successfully' , ok : true }) , { status : 200 })
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not set username", ok: false }),
      { status: 500 }
    );
  }
};
