const express = require('express');
const router = express.Router();
const chatbotController = require('../Controller/BotController');
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
  // Accept jpg, png, and svg files only
  if (file.mimetype.startsWith('image/') && ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and SVG files are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.get('/', chatbotController.getAllChatbots);
router.get('/:id', chatbotController.getChatbotById);
router.post('/', upload.single('image'), chatbotController.addChatbot);

// Update a chatbot (including its image if provided)
router.put('/:id', upload.single('image'), chatbotController.updateChatbot);

// Separate route for updating chatbot image
router.patch('/:id/image', upload.single('image'), chatbotController.updateChatbotImage);

router.patch('/:id/active', chatbotController.setActiveStatus);
router.delete('/:id', chatbotController.deleteChatbot);

module.exports = router;
