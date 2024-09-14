const Chatbot = require('../model/BotModel');

// Get all chatbots
exports.getAllChatbots = (req, res) => {
  Chatbot.getAllChatbots((err, chatbots) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve chatbots' });
    res.json(chatbots);
  });
};

// Get chatbot by ID
exports.getChatbotById = (req, res) => {
    const { id } = req.params;
  
    Chatbot.getChatbotById(id, (err, chatbot) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch chatbot' });
      }
      if (!chatbot) {
        return res.status(404).json({ message: 'Chatbot not found' });
      }
      res.json(chatbot);
    });
  };

// Add new chatbot
exports.addChatbot = (req, res) => {
  const { name, description, prompt } = req.body;
  const image = req.file ? `${req.file.filename}` : null;

  const newChatbot = { name, description, prompt, image };
  Chatbot.addChatbot(newChatbot, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to add chatbot' });
    res.json({ message: 'Chatbot added successfully' });
  });
};

// Update chatbot
exports.updateChatbot = (req, res) => {
    const { name, description, prompt, active } = req.body;
    const image = req.file ? `${req.file.filename}` : null;
    const updatedChatbot = { name, description, prompt, active, image };
  
    Chatbot.updateChatbot(req.params.id, updatedChatbot, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update chatbot' });
      res.json({ message: 'Chatbot updated successfully' });
    });
  };

// Update chatbot image
exports.updateChatbotImage = (req, res) => {
  const { id } = req.params;
  const image = req.file ? `${req.file.filename}` : null;

  if (!image) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  Chatbot.updateChatbotImage(id, image, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update image' });
    res.json({ message: 'Image updated successfully' });
  });
};

// Activate/Deactivate chatbot
exports.setActiveStatus = (req, res) => {
  const { active } = req.body;
  Chatbot.setActiveStatus(req.params.id, active, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update status' });
    res.json({ message: 'Chatbot status updated' });
  });
};

// Delete chatbot
exports.deleteChatbot = (req, res) => {
  Chatbot.deleteChatbot(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete chatbot' });
    res.json({ message: 'Chatbot deleted successfully' });
  });
};
