import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    id:{type: Number, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}, 
    role: {type: String, default:"user"},



}, {timestamps: true});

export default mongoose.models.User || mongoose.model("User", UserSchema);

