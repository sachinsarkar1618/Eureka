"use client";
import React, { useEffect, useState } from "react";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import Loader from '@/components/Loader'
import toast , {Toaster} from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [loading , setLoading] = useState(true)
  const [submitting , setSubmitting] = useState(false)
  const [feedback , setFeedback] = useState('')
  const {data : session} = useSession()
  const router = useRouter()

  useEffect(() => {
    setLoading(false)
    const timeoutId = setTimeout(() => {
      if (!session || !session.username) {
        router.push("/");
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [session]);

  const handleStarClick = (index) => {
    setRating(index);
  };

  if(loading){
    return <Loader/>
  }

  const handleSubmit = async (e) => {

    e.preventDefault()
    setSubmitting(true)
    try {
        
        const res = await fetch('/api/feedback' , {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                feedback ,
                rating : rating > 0 ? rating : undefined,
                username : session.username
            }), 
          })

          const data = await res.json()
          console.log(data)
          if(data.ok){
            toast.success('Thank you for the feedback')
            setFeedback('')
            setRating(0)
          }
          else{
            console.log(data.message)
            toast.error(data.message)
          }

    } catch (error) {
        console.log(error)
        toast.error('An error occurred')
    }
    finally{
        setSubmitting(false)
    }

  }

  return (
    <div className="flex justify-center items-center md:mt-8 md:p-10">
      <div className="bg-gray-900 p-10 text-white w-full  rounded-lg shadow-lg max-w-9/10">
        <Toaster/>
        <h1 className="text-3xl font-bold mb-8 text-center">
          Feedback / Suggestions / Complaints
        </h1>
        <p className="mb-6 text-center">
          You can send feedback, provide suggestions, or raise complaints for
          our website. Your input helps us improve and serve you better!
        </p>
        <textarea
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg"
          rows="5"
          placeholder="Write your feedback here..."
          onChange={(e) => setFeedback(e.target.value)}
          required = {true}
          value={feedback}
        ></textarea>
        <h3 className="text-center mb-2">Rating (Optional):</h3>
        <div className="flex mb-10 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} onClick={() => handleStarClick(star)} className="cursor-pointer">
              {star <= rating ? <IoIosStar size={32} /> : <IoIosStarOutline size={32} />}
            </div>
          ))}
        </div>
        <button className="w-full py-3 rounded-lg font-semibold text-black bg-white hover:bg-amber-200 transition-colors" type="submit" onClick={handleSubmit}>
          {submitting ? 'Loading' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
