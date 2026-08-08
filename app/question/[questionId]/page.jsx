"use client";
import { IoMdPerson } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { MdAddBox } from "react-icons/md";
import { FaExternalLinkAlt, FaLightbulb } from "react-icons/fa";
import ClipLoader from "@/components/ClipLoader";

const page = () => {
  const [question, setQuestion] = useState();
  const [solutions, setSolutions] = useState([]);
  const { questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [contestName, setContestName] = useState("");
  const { data: session } = useSession();
  const handle = session?.username;
  const [reactions, setReactions] = useState([]);
  const [questionIsRequested, setQuestionIsRequested] = useState(false);
  const [liking, setLiking] = useState(false);
  const [disliking, setDisliking] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const fetchQuestionData = async () => {
      if (questionId) {
        try {
          const res = await fetch("/api/questionData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              questionId,
            }),
          });
          const data = await res.json();
          if (data.ok) {
            setQuestion(data.question);
            setContestName(data.contestName);
            setQuestionIsRequested(data.requested);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error("An error occurred");
        }
      }
    };

    const fetchSolutions = async () => {
      try {
        const res = await fetch("/api/fetchSolutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId,
            size: 10,
            handle,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setSolutions(data.solutions);
          setReactions(data.reactions);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred");
      }
    };

    const fetchData = async () => {
      await fetchQuestionData();
      await fetchSolutions();
      setLoading(false);
    };

    fetchData();
  }, [handle, session]);

  if (loading || !question || !contestName) {
    return <Loader />;
  }

  const getReaction = (solutionId) => {
    if (!handle || !reactions || reactions.length == 0) {
      return 0;
    }
    const reaction = reactions.find(
      (reaction) => reaction._id.toString() === solutionId.toString()
    );
    return reaction ? reaction.value : 0; // Default to 0 if no reaction found
  };

  // Function to handle like/dislike actions
  const handleReaction = async (solutionId, value) => {
    if (!session || !handle) {
      toast("Please sign in first", {
        icon: "⚠️",
        style: {
          padding: "16px",
          color: "#b45309", // Orange text color
        },
      });
      return;
    }
    if (value == 1) {
      setLiking(true);
    } else if (value == -1) {
      setDisliking(true);
    }
    try {
      const res = await fetch("/api/reactToSolution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solutionId,
          value,
          handle, // the username of the current user
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setReactions((prevReactions) => {
          const existingReaction = prevReactions.find(
            (reaction) => reaction._id === solutionId
          );

          if (existingReaction) {
            if (existingReaction.value === value) {
              return prevReactions.filter(
                (reaction) => reaction._id !== solutionId
              );
            } else {
              return prevReactions.map((reaction) =>
                reaction._id === solutionId ? { ...reaction, value } : reaction
              );
            }
          } else {
            return [...prevReactions, { _id: solutionId, value }];
          }
        });

        setSolutions((prevSolutions) => {
          return prevSolutions.map((solution) => {
            if (solution._id === solutionId) {
              const previousReaction = reactions.find(
                (r) => r._id === solutionId
              );
              let adjustment = value;

              if (previousReaction) {
                if (previousReaction.value === value) {
                  adjustment = -value;
                } else {
                  adjustment = value - previousReaction.value;
                }
              }

              return {
                ...solution,
                netUpvotes: solution.netUpvotes + adjustment,
              };
            }
            return solution;
          });
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      if (value == 1) {
        setLiking(false);
      } else if (value == -1) {
        setDisliking(false);
      }
    }
  };

  // Handle "request for the question"
  const handleRequest = async () => {
    if (!session || !handle) {
      toast("Please sign in first", {
        icon: "⚠️",
        style: {
          padding: "16px",
          color: "#b45309",
        },
      });
      return;
    }
    setRequesting(true);
    try {
      const res = await fetch("/api/requestQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          handle,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setQuestion(data.question);
        setQuestionIsRequested(data.requested);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="flex justify-center items-center md:mt-8 md:p-10">
      <div className="bg-gray-900 p-10 text-white w-full  rounded-lg shadow-lg max-w-9/10">
        <Toaster />

        {/* Display question details */}
        {question && (
          <>
            <div className="flex justify-center mb-5">
              <Link
                href={question.questionLink}
                target="_blank"
                className="text-3xl font-bold underline text-center"
              >
                {question.title}
              </Link>
            </div>

            <div className="mb-10 text-center font-normal">
              <span className="text-2xl">
                <Link href={`/contest/${question.contest}`}>{contestName}</Link>
              </span>
            </div>

            <div className="mb-6 max-sm:mb-7 max-sm:flex max-sm:hover:underline">
              <Link
                href={question.questionLink}
                target="_blank"
                title={`${question.contestName}`}
                className="text-white break-all inline-flex items-center max-w-full"
              >
                <span className="font-semibold max-sm:font-medium whitespace-nowrap">
                  Question Link<span className="max-sm:hidden md:mx-1">:</span>
                </span>
                {/* For small screens (sm and below), show the icon; otherwise, show the link */}
                <span className="sm:hidden ml-2">
                  <FaExternalLinkAlt />
                </span>
                <span className="hidden sm:inline break-all underline font-bold">
                  {question.questionLink}
                </span>
              </Link>
            </div>

            <div className="mb-6 max-sm:mb-7 flex items-center">
              <span className="font-semibold">Requested By: </span>
              <span className="ml-2">{question.requestedBy || "None"}</span>
              <IoMdPerson className={`text-white ml-2`} />
            </div>

            {/* Add the new request section here */}
            {session && (
              <div className="flex items-center mb-6 max-sm:7">
                <span className="font-semibold">
                  Need an answer? Request for the question!
                </span>
                {!requesting ? (
                  <MdAddBox
                    onClick={handleRequest}
                    className={`ml-2 cursor-pointer ${
                      questionIsRequested ? "text-blue-500" : "text-white"
                    }`}
                    size={24}
                  />
                ) : (
                  <span className="ml-2">
                    <ClipLoader size={20} />
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center max-sm:mb-[43px] ml-1 font-semibold text-[20px]">
              <Link
                href={`/solution/add/${question._id}`}
                className="flex items-center text-teal-400 hover:text-teal-300 underline"
              >
                <FaLightbulb className="md:mr-2 max-sm:mr-3" />
                Got a solution? Share it now!
              </Link>
            </div>

            {/* Display solutions */}
            <div>
              <h3 className="text-[24px] md:text-[28px] font-semibold mb-6 text-center">
                Solutions
              </h3>

              {solutions.length > 0 ? (
                <ul>
                  {solutions.map((solution, index) => {
                    const reactionValue = getReaction(solution._id);

                    return (
                      <li
                        key={index}
                        className="mb-6 md:p-4 border-b border-gray-600"
                      >
                        <h4 className="text-[21px] font-semibold underline flex items-center">
                          <Link
                            href={`/solution/${solution._id}`}
                            className="flex items-center"
                          >
                            {solution.heading}
                            <FaExternalLinkAlt className="ml-3 text-[15px]" />
                          </Link>
                        </h4>
                        <p className="text-[15px] mt-4 max-sm:mt-4 text-gray-300">
                          <Link href={`/profile/${solution.User}`}>
                            - {solution.User}
                          </Link>
                        </p>
                        <p className="text-[15px] md:text-[16px] mt-5 mb-3 max-sm:mt-5 max-sm:mb-4 flex items-center">
                          {!liking ? (
                            <AiFillLike
                              className={`mr-2 cursor-pointer ${
                                reactionValue === 1 ? "text-blue-500" : ""
                              }`}
                              onClick={() => handleReaction(solution._id, 1)}
                            />
                          ) : (
                            <ClipLoader size={16} />
                          )}
                          <div className="mx-4">
                            {solution.netUpvotes > 0
                              ? `+${solution.netUpvotes}`
                              : solution.netUpvotes}
                          </div>
                          {!disliking ? (
                            <AiFillDislike
                              className={`ml-2 cursor-pointer ${
                                reactionValue === -1 ? "text-red-500" : ""
                              }`}
                              onClick={() => handleReaction(solution._id, -1)}
                            />
                          ) : (
                            <ClipLoader size={16} />
                          )}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No solutions available for this question.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
