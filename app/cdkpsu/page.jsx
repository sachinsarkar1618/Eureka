"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from '@/components/Loader'
import toast , {Toaster} from 'react-hot-toast'

const SimpleContestForm = () => {
  const [contestId, setContestId] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionLink, setQuestionLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {data : session} = useSession()
  const router = useRouter()
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  } , [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!session || session.username !== "simplesheep03") {
        router.push("/");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/ducksp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contestId,
          questionTitle,
          questionLink,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success('Successfully added the question')
        setContestId('')
        setQuestionTitle('')
        setQuestionLink('')
      } else {
        console.log(data.message);
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred')
    } finally {
      setSubmitting(false);
    }
  };

  if(loading){
    return <Loader/>
  }

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-md w-full sm:w-4/5 md:w-3/5 lg:w-4/5 xl:w-4/5 mt-10"
      >
        <Toaster />
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Add a Question
        </h2>

        {/* Input for Contest ID */}
        <label htmlFor="contestId" className="text-white font-medium">
          Contest ID
        </label>
        <input
          id="contestId"
          type="text"
          value={contestId}
          onChange={(e) => setContestId(e.target.value)}
          placeholder="Enter Contest ID"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 mt-1"
        />

        {/* Input for question title */}
        <label htmlFor="questionTitle" className="text-white font-medium">
          Question Title
        </label>
        <input
          id="questionTitle"
          type="text"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
          placeholder="Enter question title"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 mt-1"
        />

        {/* Input for question link */}
        <label htmlFor="questionLink" className="text-white font-medium">
          Question Link
        </label>
        <input
          id="questionLink"
          type="url"
          value={questionLink}
          onChange={(e) => setQuestionLink(e.target.value)}
          placeholder="Enter question link"
          className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400 mt-1"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-amber-200 transition"
          disabled={submitting}
        >
          {submitting ? "Loading" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SimpleContestForm;
