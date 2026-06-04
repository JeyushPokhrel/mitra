import Ticket from "../models/Ticket.js";

// GET /api/tickets - Get all tickets
export const getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

// GET /api/tickets/:id - Get single ticket details
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) {
      res.status(404);
      throw new Error("Ticket not found");
    }
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// POST /api/tickets - Create a support ticket
export const createTicket = async (req, res, next) => {
  try {
    const { subject, description, priority, category, assignee, collaborators, organization, customer, customerEmail, channel, tags } = req.body;

    const id = `T-${Math.floor(Date.now() / 1000)}`;

    const newTicket = await Ticket.create({
      id,
      subject: subject || "Untitled ticket",
      description: description || "",
      status: "New",
      priority: priority || "Medium",
      category: category || "General",
      assignee: assignee || null,
      collaborators: collaborators || [],
      organization: organization || "—",
      customer: customer || "—",
      customerEmail: customerEmail || "",
      channel: channel || "Web",
      sla: { responseDue: 240, resolutionDue: 1440, responded: false, breached: false },
      dueAt: "in 4h",
      tags: tags || [],
      messages: [],
      audit: [{ id: `a-${Date.now()}`, time: "now", actor: "System", action: "Ticket created" }],
      attachments: [],
    });

    res.status(201).json(newTicket);
  } catch (error) {
    next(error);
  }
};

// PUT /api/tickets/:id - Update ticket details
export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });

    if (!ticket) {
      res.status(404);
      throw new Error("Ticket not found");
    }

    const { status, priority, assignee, collaborators, tags, messages, audit, category } = req.body;

    // Track status change for audits
    if (status && status !== ticket.status) {
      ticket.audit.unshift({
        id: `a-${Date.now()}`,
        time: "now",
        actor: req.user ? req.user.name : "Agent",
        action: `Status → ${status}`,
      });
      ticket.status = status;
    }

    // Track assignee change for audits
    if (assignee !== undefined && assignee !== ticket.assignee) {
      ticket.audit.unshift({
        id: `a-${Date.now()}`,
        time: "now",
        actor: req.user ? req.user.name : "Agent",
        action: `Assigned to ${assignee || "unassigned"}`,
      });
      ticket.assignee = assignee;
    }

    if (priority) ticket.priority = priority;
    if (category) ticket.category = category;
    if (collaborators) ticket.collaborators = collaborators;
    if (tags) ticket.tags = tags;
    if (messages) ticket.messages = messages;
    if (audit) ticket.audit = audit;

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tickets/:id - Delete a ticket
export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ id: req.params.id });
    if (!ticket) {
      res.status(404);
      throw new Error("Ticket not found");
    }
    res.json({ message: "Ticket removed successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/tickets/bulk-delete - Delete multiple tickets
export const bulkDeleteTickets = async (req, res, next) => {
  try {
    const { ids } = req.body;
    await Ticket.deleteMany({ id: { $in: ids } });
    res.json({ message: "Tickets deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/tickets/bulk-assign - Assign multiple tickets
export const bulkAssignTickets = async (req, res, next) => {
  try {
    const { ids, assignee } = req.body;
    const tickets = await Ticket.find({ id: { $in: ids } });

    for (const ticket of tickets) {
      ticket.assignee = assignee;
      ticket.audit.unshift({
        id: `a-${Date.now()}`,
        time: "now",
        actor: req.user ? req.user.name : "Agent",
        action: `Bulk assigned to ${assignee || "unassigned"}`,
      });
      await ticket.save();
    }

    res.json({ message: "Tickets assigned successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/tickets/merge - Merge support tickets
export const mergeTickets = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length < 2) {
      res.status(400);
      throw new Error("Need at least 2 tickets to merge");
    }

    const [keepId, ...restIds] = ids;
    const ticketToKeep = await Ticket.findOne({ id: keepId });

    if (!ticketToKeep) {
      res.status(404);
      throw new Error("Destination ticket not found");
    }

    // Add audits
    ticketToKeep.audit.unshift({
      id: `a-${Date.now()}`,
      time: "now",
      actor: req.user ? req.user.name : "Agent",
      action: `Merged ${restIds.length} ticket(s) into this thread`,
    });
    await ticketToKeep.save();

    // Delete others
    await Ticket.deleteMany({ id: { $in: restIds } });

    res.json({ message: "Tickets merged successfully", keepId });
  } catch (error) {
    next(error);
  }
};
