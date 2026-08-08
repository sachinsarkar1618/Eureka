import React from "react";
import Link from "next/link";
import { FaExternalLinkAlt, FaEdit } from "react-icons/fa";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { SiCodechef, SiCodeforces, SiLeetcode } from "react-icons/si";

const AnswerCard = ({ answer, edit }) => {
  return (
    <li className="bg-gray-800 md:py-4 md:px-5 max-sm:p-7 rounded-md">
      <div className="flex justify-between items-center mb-5">
        <Link
          href={`/solution/${answer._id}`}
          className="text-[22px] flex items-center"
        >
          <span className="underline">{answer.heading}</span>
          <FaExternalLinkAlt className="ml-2 text-[15px]" />
        </Link>
      </div>

      <div className="mb-2 flex max-sm:justify-center max-sm:flex-col md:items-center">
        <Link className="text-[17px]" href={`/question/${answer.question._id}`}>
          {answer.question.title}
        </Link>

        <div className="flex items-center text-[17px] md:ml-2 font-thin max-sm:my-2 max-sm:text-[16px]">
          <Link href={`/contest/${answer.contest}`} className="flex items-center">
            <span className="block sm:inline">({answer.contestName})</span>

            {/* Conditionally render icons only on medium (md) and larger screens */}
            {answer.contestName && answer.contestName.includes("Codechef") && (
              <SiCodechef className="ml-5 text-[27px] hidden md:block" />
            )}
            {answer.contestName &&
              answer.contestName.includes("Codeforces") && (
                <SiCodeforces className="ml-5 text-[27px] hidden md:block" />
              )}
            {answer.contestName && answer.contestName.includes("Leetcode") && (
              <SiLeetcode className="ml-5 text-[27px] hidden md:block" />
            )}
          </Link>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Link
          href={`/profile/${answer.User}`}
          className="text-sm text-gray-400 block mb-3"
        >
          - {answer.User}
        </Link>
        {/* Display Edit Icon if edit is true */}
        {edit && (
          <Link href={`/solution/${answer._id}/edit`}>
            <button className="text-gray-400 hover:text-gray-200 transition">
              <FaEdit className="text-xl" title="Edit Answer" />
            </button>
          </Link>
        )}
      </div>

      <div className="mt-2 flex items-center">
        {answer.netUpvotes >= 0 ? (
          <AiFillLike className="text mr-1" />
        ) : answer.netUpvotes < 0 ? (
          <AiFillDislike className="text mr-1" />
        ) : null}
        <span
          className={`mx-2 ${
            answer.netUpvotes > 0
              ? "text-green-500"
              : answer.netUpvotes < 0
              ? "text-red-500"
              : ""
          }`}
        >
          {answer.netUpvotes <= 0 ? answer.netUpvotes : `+${answer.netUpvotes}`}
        </span>
      </div>
    </li>
  );
};

export default AnswerCard;
