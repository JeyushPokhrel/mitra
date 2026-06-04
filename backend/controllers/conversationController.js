import { Conversation, Message } from "../models/Conversation.js";

// GET /api/conversations
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find().sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// PUT /api/conversations/:id
export const updateConversation = async (req, res, next) => {
  try {
    const conv = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!conv) {
      res.status(404);
      throw new Error("Conversation not found");
    }
    res.json(conv);
  } catch (error) {
    next(error);
  }
};

// GET /api/conversations/:id/messages
export const getConversationMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// POST /api/conversations/:id/messages
export const sendConversationMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body, kind, sender, authorId, attachment } = req.body;

    const messageId = `${id}-m-${Date.now()}`;

    const message = await Message.create({
      id: messageId,
      conversationId: id,
      kind: kind || "text",
      sender: sender || "agent",
      authorId: authorId || "a1",
      body: body || "",
      attachment,
      status: "sent",
    });

    // Update conversation last message & time
    await Conversation.findOneAndUpdate(
      { id },
      {
        lastMessage: body || (attachment ? `Shared ${attachment.name}` : ""),
        lastAt: "0m", // reset time label
      }
    );

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// PUT /api/conversations/:id/messages/:msgId
export const editConversationMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;
    const { body } = req.body;

    const message = await Message.findOneAndUpdate(
      { id: msgId },
      { body, edited: true },
      { new: true }
    );

    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/conversations/:id/messages/:msgId
export const deleteConversationMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;

    const message = await Message.findOneAndDelete({ id: msgId });

    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};
