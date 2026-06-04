import Campaign from "../models/Campaign.js";

export const getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const { name, channel, status } = req.body;
    const campaign = await Campaign.create({
      name,
      channel,
      status: status || "Scheduled",
      sent: 0,
      opened: "—",
      clicked: "—",
    });
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
};
