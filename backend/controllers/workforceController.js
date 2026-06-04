import { Team, Agent, Shift, Organization, PermissionMatrix } from "../models/Workforce.js";

// Organization
export const getOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findOne();
    res.json(org);
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(org);
  } catch (error) {
    next(error);
  }
};

// Teams
export const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const { name, description, lead, color } = req.body;
    const id = `t_${Date.now()}`;
    const team = await Team.create({ id, name, description, lead, color });
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(team);
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    await Team.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Team removed successfully" });
  } catch (error) {
    next(error);
  }
};

// Agents
export const getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    next(error);
  }
};

export const inviteAgent = async (req, res, next) => {
  try {
    const { name, email, phone, role, team, department, timezone } = req.body;
    const id = `ag_${Date.now()}`;
    const agent = await Agent.create({
      id,
      name,
      email,
      phone,
      avatar: name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      role: role || "Support Agent",
      team: team || "Support",
      department: department || "Customer Success",
      timezone: timezone || "Asia/Kolkata",
      status: "offline",
      csat: 0,
      resolved: 0,
      conversations: 0,
      responseTime: "—",
    });

    // Increment team size
    await Team.findOneAndUpdate({ name: team }, { $inc: { members: 1 } });

    res.status(201).json(agent);
  } catch (error) {
    next(error);
  }
};

export const updateAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(agent);
  } catch (error) {
    next(error);
  }
};

export const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findOne({ id: req.params.id });
    if (agent) {
      // Decrement team members
      await Team.findOneAndUpdate({ name: agent.team }, { $inc: { members: -1 } });
      await Agent.findOneAndDelete({ id: req.params.id });
      // Delete shifts as well
      await Shift.deleteMany({ agent: agent.name });
    }
    res.json({ message: "Agent removed successfully" });
  } catch (error) {
    next(error);
  }
};

// Shifts
export const getShifts = async (req, res, next) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    next(error);
  }
};

export const createShift = async (req, res, next) => {
  try {
    const { agent, day, start, end, type } = req.body;
    const id = `s_${Date.now()}`;
    const shift = await Shift.create({ id, agent, day, start, end, type: type || "shift" });
    res.status(201).json(shift);
  } catch (error) {
    next(error);
  }
};

export const deleteShift = async (req, res, next) => {
  try {
    await Shift.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Shift removed successfully" });
  } catch (error) {
    next(error);
  }
};

// Permissions Matrix
export const getPermissions = async (req, res, next) => {
  try {
    const permMatrix = await PermissionMatrix.find();
    // Reduce array to mapping format matching frontend expectance: Record<RoleName, Record<ResourceName, Permission[]>>
    const mapping = {};
    permMatrix.forEach((pm) => {
      mapping[pm.role] = Object.fromEntries(pm.permissions);
    });
    res.json(mapping);
  } catch (error) {
    next(error);
  }
};

export const updatePermission = async (req, res, next) => {
  try {
    const { role, resource, permissions } = req.body;
    let pm = await PermissionMatrix.findOne({ role });
    if (!pm) {
      pm = new PermissionMatrix({ role, permissions: {} });
    }
    pm.permissions.set(resource, permissions);
    await pm.save();
    res.json({ message: "Permissions updated successfully" });
  } catch (error) {
    next(error);
  }
};
