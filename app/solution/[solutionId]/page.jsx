"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Loader from "@/components/Loader";
import { FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { HiClipboardCopy } from "react-icons/hi";
import { IoCheckmark } from "react-icons/io5";
import { WhatsappIcon } from "react-share";
import { useSession } from "next-auth/react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { setCookie, getCookie } from "cookies-next";
import ClipLoader from "@/components/ClipLoader";

const Page = () => {
  const [solution, setSolution] = useState({});
  const [questionName, setQuestionName] = useState("");
  const { solutionId } = useParams();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [reacted, setReacted] = useState(0);
  const [copied, setCopied] = useState(false);
  const [author, setAuthor] = useState(false);
  const handle = session?.username;

  const [openStates, setOpenStates] = useState([]);
  const [solutionOpen, setSolutionOpen] = useState(
    !getCookie("solution")
      ? true
      : getCookie("solution") == "true"
      ? true
      : false
  );
  const [preRequisitesOpen, setPreRequisitesOpen] = useState(false); // New state for prerequisites accordion
  const [liking, setLiking] = useState(false);
  const [disliking, setDisliking] = useState(false);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const res = await fetch("/api/fetchSolutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ solutionId, handle }),
        });

        const data = await res.json();
        if (data.ok) {
          setSolution(data.solution);
          setQuestionName(data.questionName);
          setOpenStates(
            new Array(data.solution.solutionHints?.length || 0).fill(false)
          );
          for (const reaction of data.reactions) {
            if (reaction._id.toString() === solutionId.toString()) {
              setReacted(reaction.value);
            }
          }
          if (session && session.username == data.solution.User) {
            setAuthor(true);
          }
        } else {
          console.log(data.message);
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [solutionId, handle, session]);

  const toggleAccordion = (index) => {
    setOpenStates((prevOpenStates) => {
      const newState = [...prevOpenStates];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const toggleSolutionAccordion = () => {
    setSolutionOpen(!solutionOpen);
    setCookie("solution", !solutionOpen, { maxAge: 60 * 60 * 24 * 120 });
  };

  const togglePreRequisitesAccordion = () => {
    setPreRequisitesOpen(!preRequisitesOpen); // Toggle prerequisites accordion
  };

  const handleReaction = async (solutionId, reaction) => {
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
    if (reaction == 1) {
      setLiking(true);
    } else if (reaction == -1) {
      setDisliking(true);
    }

    try {
      const res = await fetch("/api/reactToSolution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ solutionId, value: reaction, handle }),
      });

      const data = await res.json();
      if (data.ok) {
        setReacted(reacted === reaction ? 0 : reaction);
        setSolution((prevSolution) => ({
          ...prevSolution,
          netUpvotes: data.solution.netUpvotes,
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating reaction");
    } finally {
      if (reaction == 1) {
        setLiking(false);
      } else if (reaction == -1) {
        setDisliking(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("URL copied to clipboard");

    setTimeout(() => {
      setCopied(false);
    }, 2000); // Reset the icon back to clipboard after 2 seconds
  };

  const openWhatsappShare = (url, questionName, solution) => {
    const encodedText = encodeURIComponent(`*${questionName}*\n_${solution.contestName}_\n\n*Solution* :- ${solution.solutionText}\n\nFor the complete solution visit : ${url}`);
    
    // Check if the device is mobile
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
    // Use different URLs based on the device
    const whatsappUrl = isMobile 
      ? `whatsapp://send?text=${encodedText}` 
      : `https://web.whatsapp.com/send?text=${encodedText}`;
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center md:mt-6 md:p-10">
      <div className="bg-gray-900 p-10 text-white w-full rounded-lg max-w-9/10">
        <Toaster />
        {questionName && (
          <>
            <div className="text-center mb-4">
              <h2 className="mb-5 text-3xl font-bold">{solution.heading}</h2>
              <span className="max-sm:text-[19px] md:text-[22px] text-gray-50 font-semibold">
                <Link href={`/question/${solution.question}`}>
                  {`- ${questionName}`}
                </Link>
              </span>
              <span className="mt-3 block max-sm:text-[19px] md:text-[22px] text-gray-50 font-normal">
                <Link href={`/contest/${solution.contest}`}>
                  ({solution.contestName})
                </Link>
              </span>
            </div>

            <h3 className="text-lg mb-5 text-center font-thin">
              <Link href={`/profile/${solution.User}`}>- {solution.User}</Link>
            </h3>

            {author && (
              <div className="flex justify-end">
                <Link href={`/solution/${solution._id}/edit`}>
                  <button
                    className="flex items-center bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg shadow-md transition-colors duration-300 mt-6"
                    title="Edit Solution"
                  >
                    <FaEdit size={20} className="mr-2" />
                    <span>
                      Edit<span className="max-sm:hidden ml-1">Solution</span>
                    </span>
                  </button>
                </Link>
              </div>
            )}

            {solution.preRequisites && (
              <div className="mt-10 mb-6">
                <h3
                  className="font-semibold mb-4 flex items-center cursor-pointer w-[150px]"
                  onClick={togglePreRequisitesAccordion}
                >
                  <span className="mr-2">{preRequisitesOpen ? "▼" : "▶"}</span>
                  <span>Pre-Requisites:</span>
                </h3>
                {preRequisitesOpen && (
                  <div className="bg-gray-700 py-2 px-3 rounded-md">
                    <p>{solution.preRequisites}</p>
                  </div>
                )}
              </div>
            )}

            {solution.solutionHints?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Hints:</h4>
                <Accordion
                  allowMultipleExpanded={true}
                  allowZeroExpanded={true}
                >
                  {solution.solutionHints.map((hint, index) => (
                    <AccordionItem key={index} className="mb-2">
                      <AccordionItemHeading
                        onClick={() => toggleAccordion(index)}
                      >
                        <AccordionItemButton className="flex items-center mb-1 w-[75px]">
                          <span className="mr-2">
                            {openStates[index] ? "▼" : "▶"}
                          </span>
                          Hint {index + 1}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel className="rounded-sm">
                        <div className="bg-gray-700 py-1 px-3 rounded-md">
                          <p className="text-white">{hint}</p>
                        </div>
                      </AccordionItemPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            <div className="mt-6">
              <h3
                className="text-[22px] font-semibold mb-4 flex items-center cursor-pointer"
                onClick={toggleSolutionAccordion}
              >
                <span className="mr-2">{solutionOpen ? "▼" : "▶"}</span>
                <span className="underline">Solution :</span>
              </h3>
              {solutionOpen && (
                <div className="bg-gray-700 py-2 px-3 rounded-md">
                  <p>
                    {solution.solutionText
                      ? solution.solutionText.split("\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))
                      : "No solution text available"}
                  </p>
                </div>
              )}
            </div>

            {solution.acceptedCodeLink && (
              <div className="mt-7 flex items-center flex-wrap">
                <Link
                  href={solution.acceptedCodeLink}
                  target="_blank"
                  className="text-white underline flex items-center"
                  rel="noopener noreferrer"
                >
                  <h4 className="text-lg font-semibold mr-2">
                    Accepted Code Link:
                  </h4>
                  <FaExternalLinkAlt className="ml-1" />
                </Link>
              </div>
            )}

            {/* Share Solution Section */}
            <div className="my-6 flex items-center">
  <h4 className="text-lg font-semibold mr-4">
    Share the solution:
  </h4>
  <span onClick={handleCopy} className="cursor-pointer">
    {copied ? <IoCheckmark size={26} /> : <HiClipboardCopy size={26} />}
  </span>
  <span 
    onClick={() => openWhatsappShare(window.location.href, questionName, solution)} 
    className="ml-4 cursor-pointer"
  >
    <WhatsappIcon size={26} round />
  </span>
</div>

            {solution.additionalLinks?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Additional Links:</h4>
                <p className="mt-2 bg-gray-700 py-2 px-3 rounded-md">
                  {solution.additionalLinks
                    .split(/(https?:\/\/[^\s]+)/g)
                    .map((part, index) =>
                      part.match(/https?:\/\/[^\s]+/) ? (
                        <Link
                          key={index}
                          href={part}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline break-all"
                        >
                          {part}
                        </Link>
                      ) : (
                        <span key={index}>{part}</span>
                      )
                    )}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center">
              {!liking ? (
                <AiFillLike
                  className={`cursor-pointer ${
                    reacted === 1 ? "text-blue-500" : "text-gray-400"
                  }`}
                  size={26}
                  onClick={() => handleReaction(solutionId, 1)}
                />
              ) : (
                <ClipLoader size={25} />
              )}
              <span className="mx-4">
                {solution.netUpvotes > 0
                  ? `+${solution.netUpvotes}`
                  : solution.netUpvotes}
              </span>
              {!disliking ? (
                <AiFillDislike
                  className={`cursor-pointer ${
                    reacted === -1 ? "text-red-500" : "text-gray-400"
                  }`}
                  size={26}
                  onClick={() => handleReaction(solutionId, -1)}
                />
              ) : (
                <ClipLoader size={23} />
              )}
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold">Comments:</h4>
              {solution.comments && solution.comments.length > 0 ? (
                <ul className="space-y-2">
                  {solution.comments.map((comment, index) => (
                    <li key={index} className="p-3 bg-gray-800 rounded-lg">
                      <p>{comment.content || "No content"}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 mt-2">No comments available</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
