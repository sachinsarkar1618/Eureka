"use client"; // For client-side rendering
import React, { useEffect, useState } from "react";
import QuestionCard from "@/components/QuestionComponent"; // Assuming QuestionCard is in the components folder
import Loader from "@/components/Loader"; // Optional loader component for better UX
import toast, { Toaster } from "react-hot-toast"; // To display error messages
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";

const RecentlyRequested = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch questions when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/getQuestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Sending empty payload as per your request
        });

        const data = await response.json();
        if (data.ok) {
          setQuestions(data.questions); // Set the questions if successful
        } else {
          toast.error(data.message || "Failed to fetch questions");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Show a loader while data is being fetched
  if (loading) {
    return <Loader />; // Replace with a loader component if you have one
  }

  return (
    <div className="flex justify-center items-center md:p-6">
      <div className="bg-gray-900 md:p-10 max-sm:py-[50px] text-white w-full  md:rounded-lg shadow-lg max-w-9/10">
        <Toaster />
        <h2 className="text-2xl font-bold text-center mb-10">
          Recent Questions
        </h2>

        {questions.length > 0 ? (
          <ul className="space-y-4">
            {questions.map((question) => (
              <li key={question._id}>
                <QuestionCard question={question} center={false} contestNameDisplay={true} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No questions found.</p>
        )}
        <div className="mt-4 flex items-center justify-end">
          <Link href="/recentQuestions" className="flex items-center text-white">
            <span className="mr-2 text-lg underline">View All</span>
            <FaLongArrowAltRight/>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentlyRequested;
