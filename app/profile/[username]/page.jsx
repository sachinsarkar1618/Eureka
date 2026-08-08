"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AnswerCard from "@/components/AnswerCard";
import Loader from "@/components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ProfilePage = () => {
  const { username } = useParams();
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState([]);
  const [edit, setEdit] = useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/profile/${username}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.ok) {
        setUser(data.user);
        setSolutions(data.solutions);
        setReactions(data.reactions);
      } else {
        toast.error(data.message || "Failed to load user profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching the profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    if (session && session.username == username) {
      setEdit(true);
    }
  }, [username, session]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-center text-4xl text-gray-300 font-semibold mb-4">
          Oops!
        </p>
        <p className="text-center text-white text-3xl">
          We couldn't find the user you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center md:mt-8 md:p-10">
      <Toaster />
      <div className="bg-gray-900 md:p-10 max-sm:py-[50px] text-white w-full shadow-lg max-w-9/10">
        <div className="flex justify-center items-center mb-10">
          {/* User Image and Name */}
          <div className="flex max-sm:flex-col items-center md:space-x-8 max-sm:space-y-7">
            <Image
              src={user.image || "/default-profile.png"}
              alt={user.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 shadow-md"
            />
            <div className="max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:items-center">
              <h1 className="text-4xl font-semibold md:text-gray-200 max-sm:text-gray-100">
                {user.username}
              </h1>
              <p className="text-[18px] text-gray-400 md:mt-2 max-sm:mt-4">{user.name}</p>
              <p
                className={`mt-2 ${
                  user.popularity > 0
                    ? "text-green-500"
                    : user.popularity < 0
                    ? "text-red-500"
                    : "text-white"
                }`}
              >
                Popularity: {user.popularity}
              </p>
            </div>
          </div>
        </div>

        {/* Display User Solutions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">Solutions</h2>
          {solutions.length > 0 ? (
            <ul className="space-y-4">
              {solutions.map((solution) => (
                <AnswerCard
                  key={solution._id}
                  answer={solution}
                  edit={edit}
                  reactions={reactions}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No solutions provided yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
