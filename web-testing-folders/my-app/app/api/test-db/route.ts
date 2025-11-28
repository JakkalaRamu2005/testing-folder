import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";


export async function GET(){



    try{
        await connectDB();
        return NextResponse.json({message: "connection success"});
    }catch(err){
        return NextResponse.json({message: "Database connection failed", error: err}, {status: 500})
    }
}