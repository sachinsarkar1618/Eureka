"use client"; // Assuming you are using Next.js with client-side rendering
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Importing useRouter for navigation
import { PiArrowFatLeftFill } from "react-icons/pi"; // Import the left arrow icon

const BackArrow = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(true);

  // Check if we are on the home page
  if (!router || !pathname || pathname === "/") {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className={`absolute top-[170px] left-[70px] text-white p-2 hover:text-gray-500 transition max-md:hidden`}
      title="Go Back"
    >
      <PiArrowFatLeftFill className="text-2xl" />
    </button>
  );
};

export default BackArrow;
