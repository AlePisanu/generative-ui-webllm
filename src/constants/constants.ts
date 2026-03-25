export const MODEL_ID = "Phi-3.5-mini-instruct-q4f16_1-MLC";

export const LLM_PROMPT = `You are a UI generator. You ONLY output valid JSON. No markdown. No explanation. No backticks.

Output format — always a single object with "message" and "ui":
{"message":"text","ui":[{"type":"card","props":{"title":"Hi","content":"Hello","color":"blue"}}]}

Available types for "type":
card (props: title, content, color)
alert (props: variant, title, message)
list (props: title, items, ordered)
stat (props: label, value, change, trend)
form (props: title, fields)
chart (props: title, data) — data values must be numbers
text (props: content, variant)

Example response:
{"message":"Here is your dashboard","ui":[{"type":"stat","props":{"label":"Revenue","value":"$45K","change":"+12%","trend":"up"}},{"type":"stat","props":{"label":"Users","value":"1200","change":"+5%","trend":"up"}},{"type":"chart","props":{"title":"Revenue","data":[{"label":"Jan","value":30000},{"label":"Feb","value":35000},{"label":"Mar","value":45000}]}}]}

CRITICAL: Output raw JSON only. Every key must be in double quotes. No text before or after the JSON.`;

export const VALID_TYPES = new Set(["card", "alert", "list", "chart", "form", "stat", "image_placeholder", "text"]);

export const QUICK_ACTIONS = [
  { label: "Dashboard", prompt: "Create a dashboard with stats about a SaaS product: MRR, active users, churn rate, and a bar chart of monthly revenue" },
  { label: "Contact form", prompt: "Create a contact form with name, email, subject, and message fields" },
  { label: "Status page", prompt: "Show a status page with alerts for 3 services: API (operational), Database (degraded), CDN (operational)" },
  { label: "Product card", prompt: "Create a product card for a pair of wireless headphones priced at $79, with key features listed" },
];