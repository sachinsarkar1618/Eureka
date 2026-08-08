"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaExternalLinkAlt } from "react-icons/fa";
import Loader from "@/components/Loader";
import QuestionCard from "@/components/QuestionComponent";
import { SiCodechef, SiCodeforces, SiLeetcode } from "react-icons/si";

const ContestQuestions = () => {
  const { contestId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contestName, setContestName] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!contestId) return;

      try {
        const res = await fetch(`/api/getQuestions?contestId=${contestId}`);
        const data = await res.json();
        if (data.ok) {
          setQuestions(data.questions);
          setContestName(data.contestName);
        } else {
          setError(data.error || "Failed to load questions");
        }
      } catch {
        setError("An error occurred while fetching questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [contestId]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex justify-center items-center md:mt-8 md:p-10">
      <div className="bg-gray-900 md:p-10 text-white w-full  rounded-lg shadow-lg max-w-9/10">
        <h1 className="text-[35px] font-semibold mb-8 mt-10 text-white text-center flex items-center justify-center">
          {/* Conditionally render the platform icons based on contestName */}
          {contestName && contestName.includes("Codechef") && (
            <SiCodechef className="mr-5 text-[50px] hidden md:inline-block" />
          )}
          {contestName && contestName.includes("Codeforces") && (
            <SiCodeforces className="mr-5 text-[50px] hidden md:inline-block" />
          )}
          {contestName && contestName.includes("Leetcode") && (
            <SiLeetcode className="mr-5 text-[50px] hidden md:inline-block" />
          )}
          {/* Render contestName */}
          {contestName} - Questions
        </h1>

        {questions.length > 0 ? (
          <ul className="max-sm:space-y-3 md:space-y-4 lg:space-y-5">
            {questions.map((question, index) => (
              <li key={index}>
                <QuestionCard question={question} center={true} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions found for this contest.</p>
        )}
      </div>
    </div>
  );
};

export default ContestQuestions;
