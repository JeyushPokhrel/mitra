import { Contact, Company, Deal } from "../models/CRM.js";

// CONTACTS
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, country, timezone, company, designation, source, tags, notes, owner, lifecycle } = req.body;
    const id = `ct_${Date.now()}`;

    const newContact = await Contact.create({
      id,
      name: name || "Untitled Contact",
      email: email || "",
      phone: phone || "",
      avatar: (name || "U N").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      country: country || "India",
      timezone: timezone || "Asia/Kolkata",
      company: company || "Acme Corp",
      companyId: "co1",
      designation: designation || "—",
      source: source || "Website",
      tags: tags || [],
      notes: notes || "",
      owner: owner || "Rohan Kapoor",
      lifecycle: lifecycle || "Lead",
      leadScore: 50,
      customerValue: 0,
      sentiment: "neutral",
      churnRisk: 20,
    });

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({ id: req.params.id });
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteContacts = async (req, res, next) => {
  try {
    const { ids } = req.body;
    await Contact.deleteMany({ id: { $in: ids } });
    res.json({ message: "Contacts deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const bulkAssignContacts = async (req, res, next) => {
  try {
    const { ids, owner } = req.body;
    await Contact.updateMany({ id: { $in: ids } }, { owner });
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

// COMPANIES
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

// DEALS
export const getDeals = async (req, res, next) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json(deals);
  } catch (error) {
    next(error);
  }
};

export const createDeal = async (req, res, next) => {
  try {
    const { title, contactId, value, stage, owner, expectedClose } = req.body;
    const id = `d_${Date.now()}`;

    const contact = await Contact.findOne({ id: contactId });
    const contactName = contact ? contact.name : "—";
    const company = contact ? contact.company : "—";

    const newDeal = await Deal.create({
      id,
      title: title || `${company} – Deal`,
      contactId: contactId || "",
      contactName,
      company,
      value: value || 10000,
      probability: stage === "Won" ? 100 : stage === "Lost" ? 0 : 20,
      stage: stage || "New",
      owner: owner || "Rohan Kapoor",
      expectedClose: expectedClose || "30d",
    });

    res.status(201).json(newDeal);
  } catch (error) {
    next(error);
  }
};

export const updateDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!deal) {
      res.status(404);
      throw new Error("Deal not found");
    }
    res.json(deal);
  } catch (error) {
    next(error);
  }
};
