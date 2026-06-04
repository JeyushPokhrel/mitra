import Integration from "../models/Integration.js";

export const getIntegrations = async (req, res, next) => {
  try {
    const integrations = await Integration.find();
    res.json(integrations);
  } catch (error) {
    next(error);
  }
};

export const toggleIntegration = async (req, res, next) => {
  try {
    const { name } = req.body;
    const integration = await Integration.findOne({ name });
    if (!integration) {
      res.status(404);
      throw new Error("Integration not found");
    }
    integration.connected = !integration.connected;
    await integration.save();
    res.json(integration);
  } catch (error) {
    next(error);
  }
};
