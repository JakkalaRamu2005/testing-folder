import { connectDB } from "@/lib/mongodb";
import User from "@/models/User"


export async function GET(req, context) {

    const id = Number(context.params.id);

    await connectDB();
   
    const user = await User.findById({id}).lean();

    if (!user) return new Response("Not found", { status: 404 });


    return new Response(JSON.stringify(user), { status: 200 });

}



export async function PUT(req) {


    try {
        await connectDB();
        const { id } = req.params;
        const data = await req.json();
        const updated = await User.findByIdAndUpdate(id, data, { new: true }).lean();

        if (!updated) return new Response("Not found", { status: 404 });
        return new Response(JSON.stringify(updated), { status: 200 });

    } catch (err) {


        return new Response(JSON.stringify({ error: err.message }, { status: 400 }));
    }




}


export async function DELETE(req){
    await connectDB();

    const {id} = req.params;
    const deleted = await User.findByIdAndDelete(id).lean();

    if(!deleted) return new Response("Not found", {status: 404});
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}