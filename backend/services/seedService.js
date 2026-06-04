import User from "../models/User.js";
import Visitor from "../models/Visitor.js";
import ActivityLog from "../models/ActivityLog.js";
import Ticket from "../models/Ticket.js";
import Campaign from "../models/Campaign.js";
import Integration from "../models/Integration.js";
import BillingRecord from "../models/BillingRecord.js";
import Notification from "../models/Notification.js";
import AIConversation from "../models/AIConversation.js";
import { Team, Agent, Shift, Organization, PermissionMatrix } from "../models/Workforce.js";
import { Contact, Company, Deal } from "../models/CRM.js";
import { Conversation, Message } from "../models/Conversation.js";

export const seedDatabase = async () => {
  try {
    console.log("Checking if seeding is required...");

    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding users...");
      await User.create([
        {
          name: "Priya Subramaniam",
          email: "priya@mitra.app",
          password: "password123",
          role: "admin",
          status: "active",
        },
        {
          name: "Rohan Kapoor",
          email: "rohan@mitra.app",
          password: "password123",
          role: "user",
          status: "active",
        },
      ]);
    }

    // 2. Seed Workforce (Organization, Teams, Agents, Shifts, PermissionMatrix)
    const orgCount = await Organization.countDocuments();
    if (orgCount === 0) {
      console.log("Seeding Organization...");
      await Organization.create({
        name: "Mitra Labs",
        domain: "mitra.app",
        website: "https://mitra.app",
        industry: "SaaS – Customer Communication",
        employees: 142,
        timezone: "Asia/Kolkata",
        region: "APAC",
        logo: "M",
        aiEnabled: true,
        brandColor: "#B6AE9F",
        description: "Enterprise AI-powered omnichannel customer support, helpdesk and CRM.",
        owner: "Priya Subramaniam",
        plan: "Enterprise",
        seats: 200,
        seatsUsed: 142,
      });
    }

    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      console.log("Seeding Teams...");
      await Team.create([
        { id: "t1", name: "Support", description: "Tier 1 & Tier 2 customer support", lead: "Priya Subramaniam", members: 14, color: "primary" },
        { id: "t2", name: "Sales", description: "Enterprise & mid-market sales", lead: "Rohan Kapoor", members: 9, color: "info" },
        { id: "t3", name: "Billing", description: "Invoicing, refunds, dispute handling", lead: "Ava Lindqvist", members: 5, color: "warning" },
        { id: "t4", name: "Technical Support", description: "Engineering escalations & DevOps", lead: "Diego Martinez", members: 8, color: "success" },
      ]);
    }

    const agentCount = await Agent.countDocuments();
    if (agentCount === 0) {
      console.log("Seeding Agents...");
      const agentsList = [
        { id: "ag_1", name: "Rohan Kapoor", email: "rohan.kapoor@mitra.app", role: "Team Leader", team: "Sales", department: "Sales", status: "online", csat: 96, resolved: 142, conversations: 180, responseTime: "2m 14s" },
        { id: "ag_2", name: "Ava Lindqvist", email: "ava.lindqvist@mitra.app", role: "Support Agent", team: "Support", department: "Customer Success", status: "online", csat: 94, resolved: 128, conversations: 145, responseTime: "3m 45s" },
        { id: "ag_3", name: "Diego Martinez", email: "diego.martinez@mitra.app", role: "Support Agent", team: "Technical Support", department: "Engineering", status: "away", csat: 91, resolved: 110, conversations: 130, responseTime: "5m 12s" },
        { id: "ag_4", name: "Priya Subramaniam", email: "priya.subramaniam@mitra.app", role: "Super Admin", team: "Support", department: "Customer Success", status: "online", csat: 97, resolved: 98, conversations: 105, responseTime: "1m 30s" },
        { id: "ag_5", name: "Noah Becker", email: "noah.becker@mitra.app", role: "Support Agent", team: "Support", department: "Customer Success", status: "offline", csat: 89, resolved: 84, conversations: 95, responseTime: "4m 20s" },
      ];
      await Agent.create(agentsList);
    }

    const shiftCount = await Shift.countDocuments();
    if (shiftCount === 0) {
      console.log("Seeding Shifts...");
      const agents = await Agent.find();
      const shiftsList = [];
      agents.forEach((a, i) => {
        for (let d = 0; d < 5; d++) {
          const start = 8 + (i % 4) * 2;
          shiftsList.push({
            id: `s_${a.id}_${d}`,
            agent: a.name,
            day: d,
            start,
            end: start + 8,
            type: "shift",
          });
          shiftsList.push({
            id: `b_${a.id}_${d}`,
            agent: a.name,
            day: d,
            start: start + 4,
            end: start + 5,
            type: "break",
          });
        }
      });
      await Shift.create(shiftsList);
    }

    const permCount = await PermissionMatrix.countDocuments();
    if (permCount === 0) {
      console.log("Seeding Permission Matrix...");
      const roles = ["Super Admin", "Admin", "Team Leader", "Supervisor", "Support Agent", "Sales Agent", "Billing Agent"];
      const resources = ["Inbox", "Tickets", "CRM", "Visitors", "Reports", "Billing", "Workforce", "Settings"];
      const permissionsList = ["View", "Create", "Edit", "Delete", "Export", "Manage"];

      for (const role of roles) {
        const permissions = {};
        resources.forEach((r) => {
          if (role === "Super Admin") permissions[r] = [...permissionsList];
          else if (role === "Admin") permissions[r] = ["View", "Create", "Edit", "Delete", "Export"];
          else if (role === "Team Leader") permissions[r] = ["View", "Create", "Edit", "Export"];
          else if (role === "Supervisor") permissions[r] = ["View", "Edit", "Export"];
          else permissions[r] = ["View", "Create", "Edit"];
        });
        await PermissionMatrix.create({ role, permissions });
      }
    }

    // 3. Seed CRM
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      console.log("Seeding CRM Companies...");
      await Company.create([
        { id: "co1", name: "Acme Corp", domain: "acme.com", industry: "SaaS", employees: 250, value: 50000, owner: "Rohan Kapoor", contactsCount: 2, dealsCount: 1 },
        { id: "co2", name: "Globex", domain: "globex.com", industry: "Manufacturing", employees: 1200, value: 120000, owner: "Priya Subramaniam", contactsCount: 1, dealsCount: 1 },
        { id: "co3", name: "Initech", domain: "initech.com", industry: "Tech Services", employees: 80, value: 15000, owner: "Ava Lindqvist", contactsCount: 1, dealsCount: 0 },
      ]);
    }

    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      console.log("Seeding CRM Contacts...");
      await Contact.create([
        { id: "ct1", name: "Aarav Sharma", email: "aarav@acme.com", phone: "+91 9876543210", avatar: "AS", country: "India", timezone: "Asia/Kolkata", company: "Acme Corp", companyId: "co1", designation: "Product Manager", source: "Google", tags: ["pricing", "enterprise"], notes: "Interested in upgrading to Enterprise.", owner: "Rohan Kapoor", lifecycle: "Opportunity", leadScore: 85, customerValue: 2400 },
        { id: "ct2", name: "Mia Chen", email: "mia@globex.com", phone: "+1 555 123 4567", avatar: "MC", country: "USA", timezone: "America/New_York", company: "Globex", companyId: "co2", designation: "Director of IT", source: "LinkedIn", tags: ["trial"], notes: "Evaluating AI features.", owner: "Priya Subramaniam", lifecycle: "Lead", leadScore: 65, customerValue: 0 },
        { id: "ct3", name: "Liam O'Brien", email: "liam@initech.com", phone: "+44 7700 900077", avatar: "LO", country: "UK", timezone: "Europe/London", company: "Initech", companyId: "co3", designation: "SysAdmin", source: "Direct", tags: ["returning"], notes: "Past customer asking about v2 migration.", owner: "Ava Lindqvist", lifecycle: "Customer", leadScore: 95, customerValue: 490 },
      ]);
    }

    const dealCount = await Deal.countDocuments();
    if (dealCount === 0) {
      console.log("Seeding CRM Deals...");
      await Deal.create([
        { id: "d1", title: "Acme Corp – Enterprise Upgrade", contactId: "ct1", contactName: "Aarav Sharma", company: "Acme Corp", value: 24000, probability: 70, stage: "Proposal", owner: "Rohan Kapoor", expectedClose: "15d" },
        { id: "d2", title: "Globex – Chat Widget Licensing", contactId: "ct2", contactName: "Mia Chen", company: "Globex", value: 45000, probability: 30, stage: "Qualified", owner: "Priya Subramaniam", expectedClose: "45d" },
      ]);
    }

    // 4. Seed Visitors & Activities
    const visitorCount = await Visitor.countDocuments();
    if (visitorCount === 0) {
      console.log("Seeding Visitors...");
      const seededVisitors = [];
      const seedActivities = [];

      const visitorSpecs = [
        { id: "v_1", name: "Aarav Sharma", email: "aarav@acme.com", country: "India", countryCode: "IN", city: "Bengaluru", ip: "115.110.12.3", device: "Desktop", os: "macOS 14", browser: "Chrome", screen: "1920×1080", source: "Google", page: "/pricing", status: "active", score: 85 },
        { id: "v_2", name: "Mia Chen", email: "mia@globex.com", country: "USA", countryCode: "US", city: "New York", ip: "72.4.155.82", device: "Mobile", os: "iOS 17", browser: "Safari", screen: "390×844", source: "Twitter", page: "/", status: "active", score: 65 },
        { id: "v_3", name: "Emma Müller", email: "emma@piedpiper.com", country: "Germany", countryCode: "DE", city: "Berlin", ip: "80.12.30.22", device: "Desktop", os: "Windows 11", browser: "Firefox", screen: "1440×900", source: "LinkedIn", page: "/features/ai", status: "idle", score: 92 },
        { id: "v_4", name: null, email: null, country: "UK", countryCode: "GB", city: "London", ip: "188.4.12.18", device: "Tablet", os: "macOS 14", browser: "Edge", screen: "768×1024", source: "Direct", page: "/blog/ai-support", status: "leaving", score: 42 },
      ];

      for (const spec of visitorSpecs) {
        seededVisitors.push({
          id: spec.id,
          name: spec.name,
          email: spec.email,
          phone: null,
          avatar: spec.name ? spec.name.split(" ").map(n => n[0]).join("") : "V",
          country: spec.country,
          countryCode: spec.countryCode,
          city: spec.city,
          ip: spec.ip,
          device: spec.device,
          os: spec.os,
          browser: spec.browser,
          screen: spec.screen,
          source: spec.source,
          currentPage: spec.page,
          pagesVisited: 4,
          sessionSeconds: 340,
          status: spec.status,
          leadScore: spec.score,
          intent: spec.score > 75 ? "high" : spec.score > 45 ? "medium" : "low",
          conversionProbability: spec.score / 100,
          tags: spec.score > 75 ? ["hot-lead"] : [],
          vip: spec.score > 90,
          returning: spec.score > 50,
          startedAt: new Date(Date.now() - 340 * 1000),
          lastActivityAt: new Date(),
        });

        // Add activities for this visitor with strictly unique IDs
        seedActivities.push(
          { id: `act-${spec.id}-1`, visitorId: spec.id, visitorName: spec.name ?? spec.id, type: "page_view", label: "Viewed /", page: "/", at: new Date(Date.now() - 300 * 1000) },
          { id: `act-${spec.id}-2`, visitorId: spec.id, visitorName: spec.name ?? spec.id, type: "click", label: "Clicked Feature Link", page: "/", at: new Date(Date.now() - 240 * 1000) },
          { id: `act-${spec.id}-3`, visitorId: spec.id, visitorName: spec.name ?? spec.id, type: "page_view", label: `Viewed ${spec.page}`, page: spec.page, at: new Date(Date.now() - 60 * 1000) }
        );
      }

      await Visitor.create(seededVisitors);
      await ActivityLog.create(seedActivities);
    }

    // 5. Seed Support Tickets
    const ticketCount = await Ticket.countDocuments();
    if (ticketCount === 0) {
      console.log("Seeding Support Tickets...");
      await Ticket.create([
        {
          id: "T-2041",
          subject: "Payment failed during checkout",
          description: "Acme Corp user Aarav reports checking out with credit card returns error 400. Reproduced on sandbox.",
          status: "Open",
          priority: "High",
          category: "Billing",
          assignee: "Rohan Kapoor",
          collaborators: ["Ava Lindqvist"],
          organization: "Acme Corp",
          customer: "Aarav Sharma",
          customerEmail: "aarav@acme.com",
          channel: "Chat",
          sla: { responseDue: 120, resolutionDue: 720, responded: true, breached: false },
          dueAt: "in 2h",
          tags: ["billing", "enterprise"],
          messages: [
            { id: "m1", author: "Aarav Sharma", body: "Hi team, my transaction failed during payment. Please resolve urgently.", time: "1h ago", internal: false },
            { id: "m2", author: "Rohan Kapoor", body: "Checking transaction logs. Will update you in 5 minutes.", time: "45m ago", internal: false },
            { id: "m3", author: "Rohan Kapoor", body: "Internal Note: loops in technical support Diego.", time: "30m ago", internal: true }
          ],
          audit: [
            { id: "a1", time: "1h ago", actor: "System", action: "Ticket created from chat" },
            { id: "a2", time: "45m ago", actor: "Rohan Kapoor", action: "Assigned assignee Rohan" }
          ]
        },
        {
          id: "T-2040",
          subject: "Cannot reset password",
          description: "Mia Chen states clicking the password reset button does not trigger any reset email.",
          status: "Pending",
          priority: "Medium",
          category: "Account",
          assignee: "Ava Lindqvist",
          collaborators: [],
          organization: "Globex",
          customer: "Mia Chen",
          customerEmail: "mia@globex.com",
          channel: "Email",
          sla: { responseDue: 240, resolutionDue: 1440, responded: false, breached: false },
          dueAt: "in 4h",
          tags: ["auth"],
          messages: [
            { id: "m4", author: "Mia Chen", body: "Password reset link is not arriving. I tried twice.", time: "3h ago", internal: false }
          ],
          audit: [
            { id: "a3", time: "3h ago", actor: "System", action: "Ticket created from email" }
          ]
        }
      ]);
    }

    // 6. Seed Conversations & Messages
    const convCount = await Conversation.countDocuments();
    if (convCount === 0) {
      console.log("Seeding Conversations...");
      await Conversation.create([
        { id: "c1", subject: "Payment failed during checkout", customerId: "ct1", channel: "chat", status: "open", priority: "high", assignedTo: "ag_1", team: "Support", tags: ["billing"], unread: 0, lastMessage: "Thanks, that solved it!", lastAt: "2m", waitingMinutes: 2, vip: true, sentiment: "positive" },
        { id: "c2", subject: "Can you check my invoice #INV-204?", customerId: "ct2", channel: "email", status: "open", priority: "normal", assignedTo: "ag_2", team: "Billing", tags: ["invoice"], unread: 2, lastMessage: "Checking it now.", lastAt: "8m", waitingMinutes: 8, vip: false, sentiment: "neutral" },
        { id: "c3", subject: "Hello, anyone there?", customerId: "ct3", channel: "whatsapp", status: "pending", priority: "low", assignedTo: null, team: "Support", tags: ["trial"], unread: 1, lastMessage: "I need support.", lastAt: "15m", waitingMinutes: 15, vip: false, sentiment: "neutral" },
      ]);

      await Message.create([
        { id: "c1-m1", conversationId: "c1", kind: "system", sender: "system", authorId: "system", body: "Conversation started via chat.", status: "seen" },
        { id: "c1-m2", conversationId: "c1", kind: "text", sender: "customer", authorId: "ct1", body: "Hi! My checkout payment failed.", status: "seen" },
        { id: "c1-m3", conversationId: "c1", kind: "text", sender: "agent", authorId: "ag_1", body: "Let me check right away.", status: "seen" },
        { id: "c1-m4", conversationId: "c1", kind: "text", sender: "customer", authorId: "ct1", body: "Thanks, that solved it!", status: "seen" },
        
        { id: "c2-m1", conversationId: "c2", kind: "text", sender: "customer", authorId: "ct2", body: "Can you check my invoice #INV-204?", status: "delivered" },
        { id: "c3-m1", conversationId: "c3", kind: "text", sender: "customer", authorId: "ct3", body: "Hello, anyone there?", status: "delivered" },
      ]);
    }

    // 7. Seed Campaigns
    const campaignCount = await Campaign.countDocuments();
    if (campaignCount === 0) {
      console.log("Seeding Campaigns...");
      await Campaign.create([
        { name: "Welcome series", channel: "Email", status: "Active", sent: 12480, opened: "62%", clicked: "18%" },
        { name: "Black Friday promo", channel: "In-app", status: "Scheduled", sent: 0, opened: "—", clicked: "—" },
        { name: "Re-engagement", channel: "WhatsApp", status: "Active", sent: 3204, opened: "48%", clicked: "22%" },
        { name: "Feature launch: AI", channel: "Email", status: "Completed", sent: 28100, opened: "71%", clicked: "29%" },
      ]);
    }

    // 8. Seed Integrations
    const integrationCount = await Integration.countDocuments();
    if (integrationCount === 0) {
      console.log("Seeding Integrations...");
      await Integration.create([
        { name: "Slack", category: "Communication", connected: true, desc: "Get conversation alerts in Slack channels" },
        { name: "Gmail", category: "Communication", connected: true, desc: "Sync your support inbox" },
        { name: "HubSpot", category: "CRM", connected: false, desc: "Two-way contact and deal sync" },
        { name: "Salesforce", category: "CRM", connected: false, desc: "Enterprise CRM integration" },
        { name: "Shopify", category: "E-Commerce", connected: true, desc: "View orders inside conversations" },
        { name: "Zapier", category: "Automation", connected: true, desc: "Connect MITRA to 5,000+ apps" },
        { name: "Segment", category: "Analytics", connected: true, desc: "Unified customer data layer" },
      ]);
    }

    // 9. Seed Invoices / Billing
    const billingCount = await BillingRecord.countDocuments();
    if (billingCount === 0) {
      console.log("Seeding Billing Invoices...");
      await BillingRecord.create([
        { invoiceNumber: "INV-2041", date: "May 1, 2026", amount: "$79.00", status: "Paid" },
        { invoiceNumber: "INV-2040", date: "Apr 1, 2026", amount: "$79.00", status: "Paid" },
        { invoiceNumber: "INV-2039", date: "Mar 1, 2026", amount: "$79.00", status: "Paid" },
      ]);
    }

    // 10. Seed Notifications
    const notificationCount = await Notification.countDocuments();
    if (notificationCount === 0) {
      console.log("Seeding Notifications...");
      await Notification.create([
        { id: "n1", kind: "mention", title: "Priya mentioned you", body: "in T-2041 — can you take this?", at: "2m", read: false },
        { id: "n2", kind: "vip", title: "VIP escalation", body: "Mia Chen replied to her conversation", at: "5m", read: false },
        { id: "n3", kind: "sla", title: "SLA warning", body: "T-2039 breaches in 12 minutes", at: "12m", read: false },
        { id: "n4", kind: "assign", title: "Assigned to you", body: "T-2040 — Cannot reset password", at: "1h", read: true },
      ]);
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
};
