import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";


export async function POST(request: Request) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }


        if (user.password !== password) {
            return NextResponse.json({ message: "Wrong password" }, { status: 400 });
        }

        return NextResponse.json({ message: "Login successful", user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "server error", error }, { status: 500 });
    }
}