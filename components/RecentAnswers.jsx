"use client"; // Assuming you are using Next.js with client-side rendering
import React, { useEffect, useState } from "react";
import { FaLongArrowAltRight, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import Loader from "@/components/Loader"; // Import your Loader component if you have one
import toast, { Toaster } from "react-hot-toast"; 
import AnswerCard from '@/components/AnswerCard'
import { useSession } from "next-auth/react";

const RecentAnswers = () => {
  const [recentAnswers, setRecentAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reactions , setReactions] = useState([])
  const {data : session} = useSession()

  // Fetch recent answers from API
  useEffect(() => {
    const fetchRecentAnswers = async () => {
      try {
        const response = await fetch("/api/fetchSolutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            handle : session?.username
          }),
        });
        const data = await response.json();
        if (data.ok) {
          setRecentAnswers(data.solutions);
          setReactions(data.reactions)
        } else {
          toast.error(data.message || "Failed to fetch recent answers");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching recent answers");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnswers();
  }, [session]);

  if (loading) {
    return <Loader />; // Show loader while fetching data
  }

  return (
    <div className="flex justify-center items-center md:p-6">
      <div className="bg-gray-900 md:p-10 max-sm:pt-[50px] text-white w-full  md:rounded-lg shadow-lg max-w-9/10">
        <Toaster />
        <h2 className="text-2xl font-semibold mb-10 text-center">
          Recent Answers
        </h2>
        {recentAnswers.length > 0 ? (
          <ul className="space-y-4">
            {recentAnswers.map((answer) => (
              <AnswerCard key={answer._id} answer={answer} reactions = {reactions} edit={session && session.username == answer.User}/>
            ))}
          </ul>
        ) : (
          <p>No recent answers available.</p>
        )}
        <div className="mt-4 flex items-center justify-end">
          <Link
            href="/all-answers"
            className="flex items-center text-white"
          >
            <span className="mr-2 text-lg underline">View All</span>
            <FaLongArrowAltRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentAnswers;
