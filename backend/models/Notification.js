import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    kind: {
      type: String,
      enum: ["mention", "vip", "sla", "assign", "message"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      default: "",
    },
    at: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
