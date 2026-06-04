import BillingRecord from "../models/BillingRecord.js";

export const getBillingRecords = async (req, res, next) => {
  try {
    const invoices = await BillingRecord.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};
