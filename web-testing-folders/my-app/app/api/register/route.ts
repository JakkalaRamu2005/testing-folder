import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import User from "@/lib/models/User";

export async function POST(request: Request) {
    try {
        await connectDB();

        const { name, email, password } = await request.json();

        const existing = await User.findOne({ email });

        if (existing) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }
        const newUser = await User.create({ name, email, password, });


        return NextResponse.json({ message: "user registered successfullly", user: newUser }, { status: 201 });

    } catch (error) {
        console.log("Server Error:", error);
        return NextResponse.json({ message: "server error", error }, { status: 500 })
    }

}