'use client'
import { useEffect, useState } from "react";
import ComboBoxForContest from "./ComboBoxForContest";
import { useRouter } from "next/navigation";
import Loader from '@/components/Loader';
import { setCookie, getCookie } from 'cookies-next';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import toast, { Toaster } from "react-hot-toast";
import ComboBoxForQuestion from "./ComboBoxForQuestion";

const ContestForm = () => {
  const [isContestMode, setIsContestMode] = useState(!getCookie('mode') ? true : getCookie('mode') == 'true' ? true : false); 
  const [platform, setPlatform] = useState(getCookie('platform') || "codeforces");
  const [contests, setContests] = useState([]);
  const [fetchingContests, setFetchingContests] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [questions , setQuestions] = useState([]);
  const [fetchingQuestions , setFetchingQuestions] = useState(true);
  const [selectedQuestion , setSelectedQuestion] = useState(null);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);  // State to check if component is mounted

  useEffect(() => {
    setMounted(true);  // Set mounted to true once the component has mounted

    const fetchContests = async () => {
      setFetchingContests(true);
      try {
        const res = await fetch("/api/fetch-contests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ platform }),
        });

        const data = await res.json();
        if (data.ok) {
          setContests(data.contestArr);
        } else {
          console.log(data.message);
          toast.error('Could not fetch contests');
        }
      } catch (error) {
        console.log(error);
        toast.error('An error occurred');
      } finally {
        setFetchingContests(false);
      }
    };

    const fetchQuestions = async () => {
      setFetchingQuestions(true);
      try {
        const res = await fetch("/api/getQuestions?platform=all");
        
        const data = await res.json();
        if(data.ok){
          setQuestions(data.questions);
        }
        else{
          console.log(data.message);
          toast.error('Could not fetch questions');
        }

      } catch (error) {
        console.log(error);
        toast.error('An error occurred');
      }
      finally{
        setFetchingQuestions(false);
      }

    };
 
    if (isContestMode) {
      fetchContests();
    } else {
      fetchQuestions();
    }
  }, [platform , isContestMode]);

  const handleSelectedOption = (option) => {
    setSelectedValue(option);
  };

  const handleSelectedQuestion = (option) => {
    setSelectedQuestion(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const searchPath = isContestMode ? `/contest/${selectedValue.value}` : `/question/${selectedQuestion.value}`;
    router.push(searchPath);
  };

  if (!mounted || (fetchingContests && isContestMode) || (fetchingQuestions && !isContestMode)) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center">
      <Toaster/>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 max-sm:pt-[50px] rounded-lg shadow-md w-full sm:w-4/5 md:w-3/5 md:mt-9"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Search Solutions for {isContestMode ? 'Contest' : 'Question'}
        </h2>

        {/* Toggle between Contest and Question */}
        <div className="flex justify-center items-center mb-5">
          <label className="text-white font-medium mr-3">Contest</label>
          <Toggle
            checked={!isContestMode}
            onChange={() => {setIsContestMode(!isContestMode);
                setCookie('mode' , !isContestMode , { maxAge : 60 * 60 * 24 * 120})}
            }
            icons={false}
            className="react-toggle"
          />
          <label className="text-white font-medium ml-3">Question</label>
        </div>

        {/* Select input for platform */}
        {isContestMode && (
          <>
            <label htmlFor="platform" className="text-white font-medium">
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value);
                setCookie('platform', e.target.value, { maxAge: 60 * 60 * 24 * 120 });
              }}
              className="w-full p-[6.5px] border border-gray-300 rounded-md mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 font-medium"
            >
              <option value="codeforces" className="font-medium">Codeforces</option>
              <option value="codechef" className="font-medium">Codechef</option>
              <option value="leetcode" className="font-medium">Leetcode</option>
            </select>
          </>
        )}

        {/* Contest or Question Selection */}
        <label className="block text-white font-medium mb-2">
          {isContestMode ? 'Contest' : 'Question'}
        </label>

        <div className="mb-9">
          {isContestMode ? (
            <ComboBoxForContest
              fetchColourOptions={contests}
              onOptionSelect={handleSelectedOption}
            />
          ) : (
            <ComboBoxForQuestion questions={questions} onOptionSelect={handleSelectedQuestion}/>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-[6.5px] rounded-md hover:bg-amber-200 transition"
          disabled={submitting}
        >
          {submitting ? 'Loading' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default ContestForm;
