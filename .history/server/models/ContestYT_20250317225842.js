// models/Contest.js
import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Contest = mongoose.model("Contest", contestSchema);
export default ContestYT;
