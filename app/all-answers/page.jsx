"use client";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import Loader from "@/components/Loader";
import AnswerCard from "@/components/AnswerCard";
import { useSession } from "next-auth/react";

const AllAnswers = () => {
  const [solutions, setSolutions] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [solutionCount, setSolutionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState([]);
  const { data: session } = useSession();

  // Fetch solutions when the component mounts
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const res = await fetch("/api/fetchSolutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageNo,
            size: 10,
            handle: session?.username,
          }), // Start at page 1
        });

        const data = await res.json();
        if (data.ok) {
          setSolutions(data.solutions);
          setSolutionCount(data.solutionCount);
          setLastPage(data.lastPage);
          setReactions(data.reactions);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching solutions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [session]);

  // Handle page navigation
  const handlePageChange = async (newPageNo) => {
    setLoading(true);
    try {
      const res = await fetch("/api/fetchSolutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageNo: newPageNo , size : 10 }),
      });

      const data = await res.json();
      if (data.ok) {
        setSolutions(data.solutions);
        setPageNo(newPageNo);
        setLastPage(data.lastPage);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching solutions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />; // Add a loader component if desired
  }

  return (
    <div className="flex justify-center items-center md:mt-8 md:p-10">
      <div className="bg-gray-900 md:p-10 max-sm:py-[50px] text-white w-full  rounded-lg shadow-lg max-w-9/10">
        <Toaster />
        <h2 className="text-2xl font-semibold text-center mb-5">All Answers</h2>
        {solutions.length > 0 ? (
          <ul className="space-y-4">
            {solutions.map((solution) => (
              <AnswerCard
                key={solution._id}
                answer={solution}
                reactions={reactions}
              />
            ))}
          </ul>
        ) : (
          <p>No answers available.</p>
        )}
        <div className="mt-4 flex items-center justify-center space-x-7">
          <button
            onClick={() => handlePageChange(pageNo - 1)}
            disabled={pageNo === 1}
            className={`flex items-center text-white hover:underline ${
              pageNo === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaLongArrowAltLeft />
            <span className="ml-2">Previous</span>
          </button>
          <span>Page {pageNo}</span>
          <button
            onClick={() => handlePageChange(pageNo + 1)}
            disabled={lastPage}
            className={`flex items-center text-white hover:underline ${
              lastPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="mr-2">Next</span>
            <FaLongArrowAltRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllAnswers;
