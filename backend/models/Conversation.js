import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    conversationId: { type: String, required: true, index: true },
    kind: {
      type: String,
      enum: ["text", "image", "file", "video", "voice", "system", "note", "ai"],
      default: "text",
    },
    sender: {
      type: String,
      enum: ["customer", "agent", "bot", "system"],
      required: true,
    },
    authorId: { type: String, required: true }, // agent id, customer id, "bot", "system"
    body: { type: String, default: "" },
    attachment: {
      name: String,
      size: String,
      url: String,
      duration: String,
    },
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "seen", "failed"],
      default: "sent",
    },
    replyTo: String,
    edited: { type: Boolean, default: false },
    reactions: [String],
  },
  { timestamps: true }
);

const ConversationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    subject: { type: String, required: true },
    customerId: { type: String, required: true, index: true },
    channel: {
      type: String,
      enum: [
        "chat",
        "email",
        "whatsapp",
        "messenger",
        "instagram",
        "telegram",
        "slack",
        "discord",
        "sms",
      ],
      default: "chat",
    },
    status: {
      type: String,
      enum: ["open", "pending", "resolved", "snoozed", "spam"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    assignedTo: { type: String, default: null },
    team: { type: String, default: null },
    tags: { type: [String], default: [] },
    unread: { type: Number, default: 0 },
    lastMessage: { type: String, default: "" },
    lastAt: { type: String, default: "" },
    waitingMinutes: { type: Number, default: 0 },
    vip: { type: Boolean, default: false },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
    },
    locked: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    participants: { type: [String], default: [] },
    sla: {
      dueIn: String,
      breached: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", ConversationSchema);
export const Message = mongoose.model("Message", MessageSchema);
