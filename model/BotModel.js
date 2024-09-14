const db = require('../config/db');

// Get all chatbots
const getAllChatbots = (callback) => {
  const query = 'SELECT * FROM chatbots';
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Get chatbot by ID
const getChatbotById = (id, callback) => {
    const query = 'SELECT * FROM chatbots WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result[0]); // result[0] to return the single object instead of array
    });
  };

// Add new chatbot
const addChatbot = (chatbotData, callback) => {
  const { name, description, prompt, image } = chatbotData;
  const query = 'INSERT INTO chatbots (name, description, prompt, image, active) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, description, prompt, image, 1], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Update chatbot
const updateChatbot = (id, chatbotData, callback) => {
    const { name, description, prompt, active, image } = chatbotData;
    const query = 'UPDATE chatbots SET name = ?, description = ?, prompt = ?, active = ?, image = ? WHERE id = ?';
    db.query(query, [name, description, prompt, active, image, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
};

// Update chatbot image
const updateChatbotImage = (id, image, callback) => {
  const query = 'UPDATE chatbots SET image = ? WHERE id = ?';
  db.query(query, [image, id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Activate/Deactivate chatbot
const setActiveStatus = (id, active, callback) => {
  const query = 'UPDATE chatbots SET active = ? WHERE id = ?';
  db.query(query, [active, id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Delete chatbot
const deleteChatbot = (id, callback) => {
  const query = 'DELETE FROM chatbots WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  getAllChatbots,
  getChatbotById,
  addChatbot,
  updateChatbot,
  updateChatbotImage,
  setActiveStatus,
  deleteChatbot,
};
