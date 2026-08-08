import connectDB from "@/config/database"
import Contest from "@/models/Contest"
import Question from "@/models/Question"


export const POST = async(request) => {
    try {
        const data = await request.json()
        const { contestId , questionTitle , questionLink } = data
        if(!contestId || !questionTitle || !questionLink){
            return new Response(JSON.stringify({ message : 'Fill all the fields' , ok : false}) , { status : 400 })
        }
        await connectDB()
        const contest = await Contest.findById(contestId)
        if(!contest){
            return new Response(JSON.stringify({ message : 'Incorrect input' , ok : false}) , { status : 400 })
        }

        const question = new Question({
            contest : contestId,
            questionLink,
            title : questionTitle,
            contestDate : contest.contestDate,
            contestName : contest.title
        })

        await question.save()

        contest.questions.push(question._id)

        await contest.save()

        return new Response(JSON.stringify({ message : 'Question added successfully' , ok : true }) , { status : 200 })

    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message : 'Question could not be added' , ok : false}) , { status : 500 })
    }
}