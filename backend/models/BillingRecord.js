import mongoose from "mongoose";

const BillingRecordSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Paid",
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BillingRecord = mongoose.model("BillingRecord", BillingRecordSchema);
export default BillingRecord;
