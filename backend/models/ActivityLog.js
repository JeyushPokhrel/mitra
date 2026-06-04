import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    visitorName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: [
        "page_view",
        "click",
        "form_start",
        "form_abandon",
        "chat_opened",
        "chat_started",
        "scroll",
        "exit_intent",
        "added_to_cart",
      ],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      default: "",
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
export default ActivityLog;
