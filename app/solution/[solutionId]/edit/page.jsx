"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/Loader";
import Link from "next/link";

const SolutionFormPage = () => {
  const { data: session } = useSession();
  const { solutionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionName, setQuestionName] = useState("");
  const router = useRouter();
  const [solution, setSolution] = useState({});

  // State to capture form data
  const [formData, setFormData] = useState({
    heading: "",
    acceptedCodeLink: "",
    solutionHints: [],
    hintsCount: 0, // New field to capture number of hints
    solutionText: "",
    additionalLinks: "",
    preRequisites: "",
  });

  useEffect(() => {
    const fetchSolutionData = async () => {
      if (!session || !session.username) {
        return;
      }
      if (solutionId) {
        try {
          const res = await fetch("/api/fetchSolutions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              solutionId,
            }),
          });
          const data = await res.json();
          if (data.ok) {
            // setSolution(data.solution);
            setFormData({
              heading: data.solution.heading,
              acceptedCodeLink: data.solution.acceptedCodeLink,
              solutionHints: data.solution.solutionHints,
              hintsCount: data.solution.solutionHints?.length || 0,
              solutionText: data.solution.solutionText,
              additionalLinks: data.solution.additionalLinks,
              preRequisites: data.solution.preRequisites,
            });
            setQuestionName(data.questionName);
            setSolution(data.solution);
          } else {
            toast.error(data.message);
            console.log(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error("An error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSolutionData();
  }, [session]);

  // Handle form input changes
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "hintsCount") {
      const count = parseInt(value, 10);

      setFormData((prevState) => {
        const currentHints = prevState.solutionHints.slice(0, count); // Keep existing hints if fewer are needed
        const newHints = Array(count - currentHints.length).fill(""); // Fill remaining with empty strings if more hints are needed

        return {
          ...prevState,
          hintsCount: count,
          solutionHints: [...currentHints, ...newHints], // Merge existing and new empty hints
        };
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle hint input changes dynamically
  const handleHintChange = (index, value) => {
    const updatedHints = [...formData.solutionHints];
    updatedHints[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      solutionHints: updatedHints,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Process the form data here
    // console.log("Form submitted:", formData);
    if (!session) {
      toast.error("Please sign in first");
      return;
    }
    try {
      const res = await fetch(`/api/solution/edit/${solutionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          User: session.username,
          heading: formData.heading,
          solutionHints: formData.solutionHints,
          solutionText: formData.solutionText,
          additionalLinks: formData.additionalLinks,
          acceptedCodeLink: formData.acceptedCodeLink,
          preRequisites: formData.preRequisites,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success("Successfully updated the solution", { duration : 1500 }); // Display toast for 1 second

        setTimeout(() => {
          router.push(`/solution/${solutionId}`);
        }, 2500); // Delay the push by 1 second
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // console.log(solutionId , formData)

  if (loading || !solutionId) {
    return <Loader />;
  }
  return (
    <div className="flex justify-center items-center md:mt-8 md:p-8">
      <Toaster />
      <div className="bg-gray-900 p-10 text-white w-full max-w-9/10 rounded-lg shadow-lg">
        {/* Display the Question Title */}
        <Link href={`/question/${solution.question}`}>
          <h1 className="text-4xl font-bold mb-10 text-center underline">
            {questionName}
          </h1>
        </Link>

        <h2 className="text-3xl font-bold mb-6 text-center">
          Edit Your Solution
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Heading Field */}
          <div>
            <label htmlFor="heading" className="block text-sm font-medium">
              Heading
            </label>
            <input
              type="text"
              id="heading"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="heading" className="block text-sm font-medium">
              Pre-requisites (Optional)
            </label>
            <input
              type="text"
              id="preRequisites"
              name="preRequisites"
              value={formData.preRequisites}
              onChange={handleChange}
              placeholder="Eg : prefix sums, dp, etc."
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
            />
          </div>

          {/* Number of Solution Hints */}
          <div>
            <label htmlFor="hintsCount" className="block text-sm font-medium">
              Number of Hints
            </label>
            <select
              id="hintsCount"
              name="hintsCount"
              value={formData.hintsCount}
              onChange={handleChange}
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
            >
              <option value="0">None</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          {/* Dynamic Solution Hints */}
          {Array.from({ length: formData.hintsCount }, (_, index) => (
            <div key={index}>
              <label
                htmlFor={`hint-${index}`}
                className="block text-sm font-medium"
              >
                Hint {index + 1}
              </label>
              <input
                type="text"
                id={`hint-${index}`}
                name={`hint-${index}`}
                value={formData.solutionHints[index] || ""}
                onChange={(e) => handleHintChange(index, e.target.value)}
                className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
              />
            </div>
          ))}

          {/* Solution Text */}
          <div>
            <label htmlFor="solutionText" className="block text-sm font-medium">
              Solution Text
            </label>
            <textarea
              id="solutionText"
              name="solutionText"
              value={formData.solutionText}
              onChange={handleChange}
              rows="6"
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
              required
            />
          </div>

          {/* Accepted Code Link */}
          <div>
            <label
              htmlFor="acceptedCodeLink"
              className="block text-sm font-medium"
            >
              Accepted Code Link
            </label>
            <input
              type="url"
              id="acceptedCodeLink"
              name="acceptedCodeLink"
              value={formData.acceptedCodeLink}
              onChange={handleChange}
              placeholder="(Optional)"
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
            />
          </div>

          {/* Additional Links */}
          <div>
            <label
              htmlFor="additionalLinks"
              className="block text-sm font-medium"
            >
              Additional Links
            </label>
            <input
              type="text"
              id="additionalLinks"
              name="additionalLinks"
              value={formData.additionalLinks}
              onChange={handleChange}
              placeholder="(Optional)"
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-amber-200 transition"
              disabled={submitting}
            >
              {submitting ? "Loading" : "Update Solution"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolutionFormPage;
