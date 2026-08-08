import connectDB from '@/config/database';
import User from '@/models/User';

import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',  // Ensure access to refresh tokens
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',  // Use JWT sessions
    maxAge: 30 * 24 * 60 * 60, // Session duration: 30 days
    updateAge: 24 * 60 * 60,   // Update session every 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // JWT expiry time: 30 days
  },
  callbacks: {
    async signIn({ profile }) {
      try {
        // 1. Connect to database
        await connectDB();

        // 2. Check if user exists
        const userExists = await User.findOne({ email: profile.email });

        // 3. If not, add the user to the database
        if (!userExists) {
          const name = profile.name;
          await User.create({
            email: profile.email,
            name,
            image: profile.picture,
            username: ''
          });
        }

        // 4. Return true to allow sign-in
        return true;
      } catch (error) {
        console.error("Error during sign-in callback:", error);
        return false;
      }
    },
    async session({ session }) {
      try {

        await connectDB()
        // 1. Get the user from the database
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
          throw new Error("User not found");
        }

        // 2. Assign the user id and username to the session
        session.user.id = user._id.toString();
        session.username = user.username;

        // 3. Return the session object
        return session;
      } catch (error) {
        console.error("Error during session callback:", error);
        return session;
      }
    },
  },
  events: {
    async error(message) {
      console.error('NextAuth error:', message);
    },
  },
};

export default authOptions;
