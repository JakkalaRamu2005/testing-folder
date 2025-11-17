import { connectDB } from "@/lib/mongodb";
import User from "../../../../models/User"

export async function GET() {
    try {
        await connectDB();
        const dummyUsers = [
            { name: "Ram", email: "ram@example.com", role: "admin" },
            { name: "Satyadev", email: "satyadev@example.com", role: "user" },
            { name: "John Doe", email: "john@example.com", role: "user" },
            { name: "Aditi Sharma", email: "aditi@example.com", role: "manager" },
            { name: "Rahul Kumar", email: "rahul@example.com", role: "user" }
        ];


        await User.deleteMany({});

        await User.insertMany(dummyUsers);

        return new Response(

            JSON.stringify({message: "dummy users inserted successfully"},{status: 201})
        )
    }catch(err){

        return new Response(JSON.stringify({error: err.message}), {status: 500});
    }
}