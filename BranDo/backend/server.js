const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schema for Social Media Accounts
const SocialMediaAccountSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  username: { type: String, required: true },
  status: { type: String, default: 'disconnected' },
  posts: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  settings: {
    autoPost: { type: Boolean, default: false },
    autoLike: { type: Boolean, default: false },
    autoComment: { type: Boolean, default: false },
    postSchedule: { type: String, default: 'daily' }
  }
});

const SocialMediaAccount = mongoose.model('SocialMediaAccount', SocialMediaAccountSchema);

// Global automation state
let automationState = {
  isRunning: false,
  startTime: null,
  status: 'stopped'
};

// Routes

// Get automation status
app.get('/api/automation/status', (req, res) => {
  res.json(automationState);
});

// Start automation
app.post('/api/automation/start', async (req, res) => {
  try {
    if (automationState.isRunning) {
      return res.status(400).json({ error: 'Automation is already running' });
    }

    automationState = {
      isRunning: true,
      startTime: new Date(),
      status: 'running'
    };

    console.log('🚀 BranDo Social Media Automation Started');
    
    // TODO: Start actual Instagram automation here
    // This is where Riona AI Agent logic would go
    
    res.json({ 
      message: 'Automation started successfully', 
      status: automationState 
    });
  } catch (error) {
    console.error('Error starting automation:', error);
    res.status(500).json({ error: 'Failed to start automation' });
  }
});

// Stop automation
app.post('/api/automation/stop', async (req, res) => {
  try {
    automationState = {
      isRunning: false,
      startTime: null,
      status: 'stopped'
    };

    console.log('⏹️ BranDo Social Media Automation Stopped');
    
    res.json({ 
      message: 'Automation stopped successfully', 
      status: automationState 
    });
  } catch (error) {
    console.error('Error stopping automation:', error);
    res.status(500).json({ error: 'Failed to stop automation' });
  }
});

// Get all social media accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await SocialMediaAccount.find();
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Add new social media account
app.post('/api/accounts', async (req, res) => {
  try {
    const { platform, username } = req.body;
    
    const newAccount = new SocialMediaAccount({
      platform,
      username,
      status: 'connected'
    });
    
    await newAccount.save();
    res.json(newAccount);
  } catch (error) {
    console.error('Error adding account:', error);
    res.status(500).json({ error: 'Failed to add account' });
  }
});

// Update account settings
app.put('/api/accounts/:id/settings', async (req, res) => {
  try {
    const { id } = req.params;
    const settings = req.body;
    
    const account = await SocialMediaAccount.findByIdAndUpdate(
      id,
      { $set: { settings } },
      { new: true }
    );
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    res.json(account);
  } catch (error) {
    console.error('Error updating account settings:', error);
    res.status(500).json({ error: 'Failed to update account settings' });
  }
});

// Test Instagram connection
app.post('/api/instagram/test', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // TODO: Implement actual Instagram connection test
    // This would use Instagram Private API or Puppeteer
    
    console.log(`Testing Instagram connection for: ${username}`);
    
    // Simulated response for now
    res.json({ 
      success: true, 
      message: 'Instagram connection test successful',
      username 
    });
  } catch (error) {
    console.error('Error testing Instagram connection:', error);
    res.status(500).json({ error: 'Failed to test Instagram connection' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BranDo Social Media Backend is running',
    timestamp: new Date().toISOString(),
    automation: automationState
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BranDo Social Media Backend running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🗄️ MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured'}`);
});