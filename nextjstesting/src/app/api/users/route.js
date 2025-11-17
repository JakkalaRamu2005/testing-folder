

import { connectDB } from "@/lib/mongodb";

import User from "../../../models/User"

export async function GET(){

    await connectDB();
    const users = await User.find().lean();




    return new Response(JSON.stringify(users), {status: 200});

}


export async function POST(req){

    try{
          await connectDB();

    const body = await req.json();
    const user = await User.create(body);
    return new Response(JSON.stringify(user), {status: 201})

    }catch(err){
        return new Response(JSON.stringify({error: err.message}, {status: 400}));
    }
  
}