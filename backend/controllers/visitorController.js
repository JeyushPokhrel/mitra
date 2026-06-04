import Visitor from "../models/Visitor.js";
import ActivityLog from "../models/ActivityLog.js";

// Get all visitors
export const getVisitors = async (req, res, next) => {
  try {
    const visitors = await Visitor.find().sort({ lastActivityAt: -1 });
    res.json(visitors);
  } catch (error) {
    next(error);
  }
};

// Get single visitor by ID
export const getVisitorById = async (req, res, next) => {
  try {
    const visitor = await Visitor.findOne({ id: req.params.id });
    if (!visitor) {
      res.status(404);
      throw new Error("Visitor not found");
    }
    res.json(visitor);
  } catch (error) {
    next(error);
  }
};

// Create or update visitor
export const upsertVisitor = async (req, res, next) => {
  try {
    const { id, name, email, currentPage, pagesVisited, status, leadScore, intent, conversionProbability, tags, vip, returning, device, country, countryCode, city, ip, os, browser, screen, source } = req.body;

    let visitor = await Visitor.findOne({ id });

    if (visitor) {
      // Update existing
      visitor.currentPage = currentPage || visitor.currentPage;
      visitor.pagesVisited = pagesVisited !== undefined ? pagesVisited : visitor.pagesVisited;
      visitor.status = status || visitor.status;
      visitor.leadScore = leadScore !== undefined ? leadScore : visitor.leadScore;
      visitor.intent = intent || visitor.intent;
      visitor.conversionProbability = conversionProbability !== undefined ? conversionProbability : visitor.conversionProbability;
      visitor.tags = tags || visitor.tags;
      visitor.vip = vip !== undefined ? vip : visitor.vip;
      visitor.returning = returning !== undefined ? returning : visitor.returning;
      visitor.lastActivityAt = new Date();
      await visitor.save();
    } else {
      // Create new
      visitor = await Visitor.create({
        id,
        name,
        email,
        avatar: name ? name.split(" ").map(n => n[0]).join("") : "V",
        country: country || "India",
        countryCode: countryCode || "IN",
        city: city || "Bengaluru",
        ip: ip || "127.0.0.1",
        device: device || "Desktop",
        os: os || "macOS",
        browser: browser || "Chrome",
        screen: screen || "1920×1080",
        source: source || "Direct",
        currentPage: currentPage || "/",
        pagesVisited: pagesVisited || 1,
        status: status || "active",
        leadScore: leadScore || 0,
        intent: intent || "low",
        conversionProbability: conversionProbability || 0,
        tags: tags || [],
        vip: vip || false,
        returning: returning || false,
      });
    }

    res.json(visitor);
  } catch (error) {
    next(error);
  }
};

// Update tags, VIP status or agent assignment
export const updateVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patch = req.body;

    const visitor = await Visitor.findOne({ id });
    if (!visitor) {
      res.status(404);
      throw new Error("Visitor not found");
    }

    Object.assign(visitor, patch);
    visitor.lastActivityAt = new Date();
    await visitor.save();

    res.json(visitor);
  } catch (error) {
    next(error);
  }
};

// Delete / Block visitor
export const deleteVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visitor = await Visitor.findOneAndDelete({ id });
    if (!visitor) {
      res.status(404);
      throw new Error("Visitor not found");
    }
    // Also clear activity logs
    await ActivityLog.deleteMany({ visitorId: id });
    res.json({ message: "Visitor blocked/deleted successfully" });
  } catch (error) {
    next(error);
  }
};
