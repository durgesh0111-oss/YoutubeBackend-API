import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },    
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: "Tweer" },
    likedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);