import mongoose from "mongoose";

const AIConversationSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    deflected: {
      type: Boolean,
      default: true,
    },
    tokensUsed: {
      type: Number,
      default: 150,
    },
    confidenceScore: {
      type: Number,
      default: 92,
    },
  },
  {
    timestamps: true,
  }
);

const AIConversation = mongoose.model("AIConversation", AIConversationSchema);
export default AIConversation;
