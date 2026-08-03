"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/Loader";

const ChooseUsername = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname;

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session && session.username) {
      router.push("/");
    }
  }, [session, pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!session) {
      toast.error("Please sign in first");
      return;
    }
    try {
      const res = await fetch("/api/set-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email, username }),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success(`Welcome ${username}`);
        router.push("/");
        location.reload();
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center md:mt-8 md:p-10">
      <Toaster />
      <div className="bg-gray-900 p-10 text-white w-full  rounded-lg shadow-lg max-w-9/10">
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome !!</h1>
        <p className="text-lg mt-7 text-center">
          We're excited to have you! Please choose a username that will be used
          throughout the site.
        </p>
        <p className="text-lg mb-10 md:mt-3 max-sm:mt-2 text-center">
          <span className="font-medium">Note:</span> This is{" "}
          <span className="font-medium">not</span> your Codeforces, CodeChef, or
          LeetCode handle.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-8"
        >
          <input
            type="text"
            className="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-center"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-white hover:bg-amber-200 text-black font-semibold rounded-md transition-all"
            disabled={submitting}
          >
            {submitting ? "Loading" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChooseUsername;
