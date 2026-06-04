export const conversationVolume = [
  { day: "Mon", conversations: 320, resolved: 280 },
  { day: "Tue", conversations: 410, resolved: 360 },
  { day: "Wed", conversations: 380, resolved: 340 },
  { day: "Thu", conversations: 520, resolved: 470 },
  { day: "Fri", conversations: 610, resolved: 540 },
  { day: "Sat", conversations: 290, resolved: 260 },
  { day: "Sun", conversations: 240, resolved: 220 },
];

export const csatTrend = [
  { week: "W1", score: 88 },
  { week: "W2", score: 90 },
  { week: "W3", score: 92 },
  { week: "W4", score: 91 },
  { week: "W5", score: 94 },
  { week: "W6", score: 95 },
];

export const channelBreakdown = [
  { name: "Live Chat", value: 42 },
  { name: "Email", value: 28 },
  { name: "WhatsApp", value: 18 },
  { name: "Instagram", value: 12 },
];

export const conversations = [
  { id: "c1", name: "Aarav Sharma", last: "Thanks, that solved it!", channel: "Chat", time: "2m", unread: 0, status: "open", avatar: "AS" },
  { id: "c2", name: "Mia Chen", last: "Can you check my invoice #INV-204?", channel: "Email", time: "8m", unread: 2, status: "open", avatar: "MC" },
  { id: "c3", name: "Liam O'Brien", last: "Hello, anyone there?", channel: "WhatsApp", time: "15m", unread: 1, status: "pending", avatar: "LO" },
  { id: "c4", name: "Sofia Rossi", last: "I need to upgrade my plan", channel: "Chat", time: "32m", unread: 0, status: "open", avatar: "SR" },
  { id: "c5", name: "Noah Patel", last: "Refund request for order #882", channel: "Email", time: "1h", unread: 3, status: "open", avatar: "NP" },
  { id: "c6", name: "Emma Müller", last: "Loving the new dashboard ✨", channel: "Instagram", time: "2h", unread: 0, status: "closed", avatar: "EM" },
];

export const tickets = [
  { id: "T-2041", subject: "Payment failed during checkout", priority: "High", status: "Open", assignee: "Rohan K.", sla: "2h left", customer: "Mia Chen" },
  { id: "T-2040", subject: "Cannot reset password", priority: "Medium", status: "In Progress", assignee: "Ava L.", sla: "5h left", customer: "Liam O'Brien" },
  { id: "T-2039", subject: "Widget not loading on Safari", priority: "High", status: "Open", assignee: "Diego M.", sla: "1h left", customer: "Sofia Rossi" },
  { id: "T-2038", subject: "Integration with HubSpot", priority: "Low", status: "Waiting", assignee: "Priya S.", sla: "—", customer: "Noah Patel" },
  { id: "T-2037", subject: "Feature request: dark mode", priority: "Low", status: "Closed", assignee: "Ava L.", sla: "—", customer: "Emma Müller" },
];

export const visitors = [
  { id: "v1", page: "/pricing", country: "India", city: "Bengaluru", device: "Desktop", time: "3m 12s", referrer: "google.com" },
  { id: "v2", page: "/", country: "USA", city: "New York", device: "Mobile", time: "1m 04s", referrer: "twitter.com" },
  { id: "v3", page: "/features/ai", country: "Germany", city: "Berlin", device: "Desktop", time: "6m 30s", referrer: "direct" },
  { id: "v4", page: "/blog/ai-support", country: "UK", city: "London", device: "Tablet", time: "2m 18s", referrer: "linkedin.com" },
  { id: "v5", page: "/contact", country: "Brazil", city: "São Paulo", device: "Mobile", time: "45s", referrer: "google.com" },
];

export const agents = [
  { name: "Rohan Kapoor", role: "Senior Agent", csat: 96, resolved: 142, status: "online" },
  { name: "Ava Lindqvist", role: "Agent", csat: 94, resolved: 128, status: "online" },
  { name: "Diego Martinez", role: "Agent", csat: 91, resolved: 110, status: "away" },
  { name: "Priya Subramaniam", role: "Team Lead", csat: 97, resolved: 98, status: "online" },
  { name: "Noah Becker", role: "Agent", csat: 89, resolved: 84, status: "offline" },
];

export const integrations = [
  { name: "Slack", category: "Communication", connected: true, desc: "Get conversation alerts in Slack channels" },
  { name: "Gmail", category: "Communication", connected: true, desc: "Sync your support inbox" },
  { name: "HubSpot", category: "CRM", connected: false, desc: "Two-way contact and deal sync" },
  { name: "Salesforce", category: "CRM", connected: false, desc: "Enterprise CRM integration" },
  { name: "Shopify", category: "E-Commerce", connected: true, desc: "View orders inside conversations" },
  { name: "WooCommerce", category: "E-Commerce", connected: false, desc: "Order data and refunds" },
  { name: "Zapier", category: "Automation", connected: true, desc: "Connect MITRA to 5,000+ apps" },
  { name: "Make", category: "Automation", connected: false, desc: "Visual workflow automation" },
  { name: "Mixpanel", category: "Analytics", connected: false, desc: "Track product events" },
  { name: "Segment", category: "Analytics", connected: true, desc: "Unified customer data layer" },
];

export const leads = [
  { stage: "New", count: 24, items: ["Acme Corp", "Globex", "Initech", "Umbrella"] },
  { stage: "Qualified", count: 18, items: ["Stark Industries", "Wayne Enterprises", "Hooli"] },
  { stage: "Proposal", count: 9, items: ["Pied Piper", "Soylent"] },
  { stage: "Won", count: 12, items: ["Massive Dynamic", "Cyberdyne"] },
];
