import connectDB from "@/config/database"
import Notification from "@/models/Notification"
import User from "@/models/User"
import { getSessionUser } from "@/utils/getSessionUser"


export const POST = async(request) => {

    try {

        const session = await getSessionUser()
        
        const data = await request.json()
        const {feedback  , rating , username} = data
        if(!feedback){
            return new Response(JSON.stringify({ message : 'Fill all the fields' , ok : false}) , { status : 400 })
        }
        if(!session || session.username != username){
            return new Response(JSON.stringify({
                message: 'Unauthorized', ok: false
            }), { status: 401 });
        }

        await connectDB()
        let user = await User.find({ username })
        if(!user || user.length != 1){
            return new Response(JSON.stringify({ message : 'Incorrect input' , ok : false}) , { status : 400 })
        }
        if(rating && ![1 , 2 , 3 , 4 , 5].includes(rating)){
            return new Response(JSON.stringify({ message : 'Incorrect input' , ok : false}) , { status : 400 })
        }
        user = user[0]

        const notification = new Notification({
            sender : user._id,
            receiver : '66f2633ef87a3067b55e074a',
            body : feedback , 
            rating ,
            toAdmin : true,
            read : false,
        })

        await notification.save()

        return new Response(JSON.stringify({ message : 'Feedback sent successfully' , ok : true }) , { status : 200 })
        
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message : 'Could not submit feedback' , ok : false }) , { status : 500 })
    }

}