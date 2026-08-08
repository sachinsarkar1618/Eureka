import connectDB from "@/config/database";
import Contest from "@/models/Contest";
import Question from "@/models/Question";

export const GET = async (request) => {
  try {
    // Extract the query parameters from the URL
    const { searchParams } = new URL(request.url);
    const contestId = searchParams.get("contestId"); 
    const platform = searchParams.get("platform")

    await connectDB()

    if(platform == "all"){
      const questionsArr = await Question.find({})
      let questions = questionsArr.map((question) => {return { value : question._id , label : `${question.title} (${question.contestName})` , contestDate : question.contestDate , solutionsLength : question.solutions.length , requestedBy : question.requestedBy }})

      questions.sort((a , b) => {
        if(a.contestDate == b.contestDate){
          if(a.solutionsLength == b.solutionsLength){
            return b.requestedBy - a.requestedBy
          }
          return b.solutionsLength - a.solutionsLength
        }
        return b.contestDate - a.contestDate
      })
      
      return new Response(JSON.stringify({ message : 'Fetched the questions successfully' , ok : true , questions }) , { status : 200 })
    }

    if (!contestId) {
      return new Response(
        JSON.stringify({ message: "Fill all the fields", ok: false }),
        { status: 400 }
      );
    }

    const contest = await Contest.findById(contestId).populate({
      path: "questions", // Name of the field in Contest that holds the array of question _ids
      model: "Question", // The model you're populating from (Question model)
    });

    if (!contest) {
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Fetched the questions",
        ok: true,
        questions: contest.questions,
        contestName: contest.title,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred", ok: false }),
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
  try {
    const data = await request.json();
    const { size, pageNo } = data;

    await connectDB();

    const actualSize = size || 3;

    // console.log(await Question.estimatedDocumentCount())

    if (pageNo) {
      const questions = await Question.aggregate([
        {
          $addFields: {
            solutionsLength: { $size: "$solutions" }  // Calculate the length of the solutions array
          }
        },
        {
          $sort: {
            requestedBy: -1,      // First sort by requestedBy
            contestDate: -1,      // Then sort by contestDate
            solutionsLength: -1   // Lastly, sort by the length of the solutions array
          }
        },
        {
          $skip: (pageNo - 1) * 10  // Skip the documents for pagination
        },
        {
          $limit: actualSize         // Limit the result to actualSize
        }
      ]);
      

      return new Response(
        JSON.stringify({
          message: "Questions fetched successfully",
          ok: true,
          questions,
          lastPage: await Question.estimatedDocumentCount() == (pageNo - 1) * actualSize + questions.length,
        }),
        { status: 200 }
      );
    }

    const questions = await Question.aggregate([
      {
        $addFields: {
          solutionsLength: { $size: "$solutions" }  // Calculate the length of the solutions array
        }
      },
      {
        $sort: {
          contestDate: -1,
          solutionsLength: -1,  // Sort by the calculated length of the solutions array
          requestedBy: -1
        }
      },
      { $limit: actualSize }
    ]);
    

    return new Response(
      JSON.stringify({
        message: "Questions fetched successfully",
        ok: true,
        questions,
      }),
      { status: 200 }
    );
    
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not fetch questions", ok: false }),
      { status: 500 }
    );
  }
};
