import ActivityLog from "../models/ActivityLog.js";
import Visitor from "../models/Visitor.js";

// Get live activity logs
export const getActivities = async (req, res, next) => {
  try {
    const { visitorId } = req.query;
    const filter = visitorId ? { visitorId } : {};

    const activities = await ActivityLog.find(filter)
      .sort({ at: -1 })
      .limit(40);

    res.json(activities);
  } catch (error) {
    next(error);
  }
};

// Create a new activity log
export const createActivity = async (req, res, next) => {
  try {
    const { visitorId, type, label, page } = req.body;

    const visitor = await Visitor.findOne({ id: visitorId });
    const visitorName = visitor ? (visitor.name || visitor.id) : visitorId;

    const id = `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const activity = await ActivityLog.create({
      id,
      visitorId,
      visitorName,
      type,
      label,
      page,
      at: new Date(),
    });

    // Also update visitor's last active fields
    if (visitor) {
      visitor.lastActivityAt = new Date();
      visitor.currentPage = page || visitor.currentPage;
      if (type === "page_view") {
        visitor.pagesVisited += 1;
      }
      await visitor.save();
    }

    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
};
