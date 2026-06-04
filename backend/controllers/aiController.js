import AIConversation from "../models/AIConversation.js";

const aiResults = {
  generate: "Hi! Thanks for reaching out — I've reviewed your account and processed the refund. You should see it on your card within 5–7 business days. Let me know if anything else comes up. 🙌",
  rephrase: "Thanks for the patience — your refund is on its way and should land in your account within 5–7 business days.",
  friendly: "Hey! 🌟 Totally got you — refund is out the door and should show up within 5–7 business days. Yell anytime!",
  formal: "Thank you for your patience. The refund has been issued and will appear in your account within 5–7 business days.",
  grammar: "Thanks for your patience. The refund has been issued and will appear in your account within 5–7 business days.",
  translate: "Gracias por su paciencia. El reembolso ha sido emitido y aparecerá en su cuenta en un plazo de 5 a 7 días hábiles.",
  summarize: "Customer reported a failed payment, shared a screenshot, requested a refund. Agent issued a refund and shared an updated invoice. Customer confirmed and thanked the team.",
  next: "Schedule a 2-day follow-up to confirm the refund landed and offer a 1-month credit.",
};

export const runAiAction = async (req, res, next) => {
  try {
    const { action, text } = req.body;

    const result = aiResults[action] || "AI deflection processed successfully.";

    // Log the AI interaction
    await AIConversation.create({
      prompt: text || `AI Action: ${action}`,
      response: result,
      category: action,
      deflected: true,
      tokensUsed: 150,
      confidenceScore: 92,
    });

    res.json({ result });
  } catch (error) {
    next(error);
  }
};
