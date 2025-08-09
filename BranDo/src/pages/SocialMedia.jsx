import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PlayIcon, StopIcon, CogIcon, PlusIcon, ChartBarIcon, UserGroupIcon, Cog6ToothIcon, HashtagIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';

// LightBlob component
const LightBlob = ({ position, color, scale }) => {
  return (
    <Sphere args={[1, 32, 32]} scale={scale} position={position}>
      <meshStandardMaterial attach="material" color={color} emissive={color} emissiveIntensity={0.5} />
    </Sphere>
  );
};

// LightBlobs component with social media themed colors
const LightBlobs = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />
      <LightBlob position={[-6, 2, -10]} color="#1DA1F2" scale={[8, 8, 8]} />
      <LightBlob position={[6, -3, -12]} color="#E1306C" scale={[10, 10, 10]} />
      <LightBlob position={[-4, -1, -8]} color="#4267B2" scale={[6, 6, 6]} />
      <LightBlob position={[4, 3, -14]} color="#FF0000" scale={[9, 9, 9]} />
      <LightBlob position={[0, 0, -15]} color="#0077B5" scale={[7, 7, 7]} />
    </>
  );
};

const SocialMedia = () => {
  const { userToken } = useStateContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [automationSettings, setAutomationSettings] = useState({
    autoPost: false,
    autoLike: false,
    autoComment: false,
    postSchedule: 'daily'
  });
  const [hashtagCategories, setHashtagCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customHashtags, setCustomHashtags] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [smartHashtags, setSmartHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (!userToken) {
      navigate('/signup');
    } else {
      fetchAccounts();
      checkAutomationStatus();
      fetchHashtagCategories();
    }
  }, [userToken, navigate]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const checkAutomationStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/automation/status`);
      if (response.ok) {
        const data = await response.json();
        setIsAgentRunning(data.isRunning);
      }
    } catch (error) {
      console.error('Error checking automation status:', error);
    }
  };

  const handleBackClick = () => {
    navigate('/chat');
  };

  const toggleAgent = async () => {
    setLoading(true);
    try {
      const endpoint = isAgentRunning ? 'stop' : 'start';
      const response = await fetch(`${API_BASE_URL}/automation/${endpoint}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAgentRunning(data.status.isRunning);
      }
    } catch (error) {
      console.error('Error toggling automation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (setting, value) => {
    setAutomationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const fetchHashtagCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hashtags/categories`);
      if (response.ok) {
        const data = await response.json();
        setHashtagCategories(data);
      }
    } catch (error) {
      console.error('Error fetching hashtag categories:', error);
    }
  };

  const generateSmartHashtags = async () => {
    if (!businessDescription.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/hashtags/smart-suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ businessDescription })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSmartHashtags(data.suggestedHashtags || []);
      }
    } catch (error) {
      console.error('Error generating smart hashtags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHashtagSelect = (hashtag) => {
    if (!selectedHashtags.includes(hashtag)) {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
  };

  const handleHashtagRemove = (hashtag) => {
    setSelectedHashtags(selectedHashtags.filter(h => h !== hashtag));
  };

  const addCustomHashtags = () => {
    const hashtags = customHashtags
      .split(/[,\s]+/)
      .map(h => h.trim())
      .filter(h => h.length > 0)
      .map(h => h.startsWith('#') ? h : `#${h}`);
    
    const newHashtags = hashtags.filter(h => !selectedHashtags.includes(h));
    setSelectedHashtags([...selectedHashtags, ...newHashtags]);
    setCustomHashtags('');
  };

  const deleteAccount = async (accountId) => {
    if (!window.confirm('Are you sure you want to disconnect this account?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setAccounts(accounts.filter(acc => acc.id !== accountId));
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold">Total Accounts</h3>
          <p className="text-3xl font-bold">{accounts.length}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold">Total Posts</h3>
          <p className="text-3xl font-bold">{accounts.reduce((sum, acc) => sum + acc.posts, 0)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold">Total Followers</h3>
          <p className="text-3xl font-bold">{accounts.reduce((sum, acc) => sum + acc.followers, 0)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">AI Agent Status</h3>
          <button
            onClick={toggleAgent}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isAgentRunning 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              isAgentRunning ? <StopIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />
            )}
            <span>
              {loading ? 'Processing...' : (isAgentRunning ? 'Stop Agent' : 'Start Agent')}
            </span>
          </button>
        </div>
        <p className="text-gray-600">
          {isAgentRunning 
            ? 'Riona AI Agent is actively managing your social media accounts'
            : 'AI Agent is currently stopped'
          }
        </p>
        {isAgentRunning && (
          <div className="mt-2 text-sm text-blue-600 animate-pulse">
            • Auto-posting enabled • Auto-liking active • Generating AI comments
          </div>
        )}
      </div>
    </div>
  );

  const renderAccounts = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Connected Accounts</h3>
        <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          <PlusIcon className="h-5 w-5" />
          <span>Add Account</span>
        </button>
      </div>
      
      {accounts.map(account => (
        <div key={account.id} className="bg-white p-6 rounded-lg border flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {account.platform[0]}
            </div>
            <div>
              <h4 className="font-semibold">{account.username}</h4>
              <p className="text-sm text-gray-600">{account.platform}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{account.posts}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{account.followers}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              account.status === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {account.status}
            </div>
            <button
              onClick={() => deleteAccount(account.id)}
              disabled={loading}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Disconnect Account"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Automation Settings</h3>
      
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Auto Post</h4>
            <p className="text-sm text-gray-600">Automatically post content using AI</p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={automationSettings.autoPost}
            onChange={(e) => handleSettingChange('autoPost', e.target.checked)}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Auto Like</h4>
            <p className="text-sm text-gray-600">Automatically like relevant posts</p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={automationSettings.autoLike}
            onChange={(e) => handleSettingChange('autoLike', e.target.checked)}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Auto Comment</h4>
            <p className="text-sm text-gray-600">Generate and post AI comments</p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={automationSettings.autoComment}
            onChange={(e) => handleSettingChange('autoComment', e.target.checked)}
          />
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Schedule
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            value={automationSettings.postSchedule}
            onChange={(e) => handleSettingChange('postSchedule', e.target.value)}
          >
            <option value="hourly">Every Hour</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Riona AI Integration</h4>
        <p className="text-yellow-700 text-sm">
          This social media manager is powered by Riona AI Agent for Instagram automation. 
          Configure your Instagram credentials and AI settings to get started with automated posting, 
          liking, and AI-generated comments.
        </p>
      </div>
    </div>
  );

  const renderHashtags = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Hashtag Manager</h3>
      
      {/* Smart Hashtag Generation */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">AI-Powered Hashtag Generator</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your business or post content
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="e.g., I run an organic food restaurant specializing in healthy Mediterranean cuisine..."
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
            />
          </div>
          <button
            onClick={generateSmartHashtags}
            disabled={loading || !businessDescription.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <HashtagIcon className="h-4 w-4" />
            )}
            <span>{loading ? 'Generating...' : 'Generate Smart Hashtags'}</span>
          </button>
          
          {smartHashtags.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">AI-generated hashtags:</p>
              <div className="flex flex-wrap gap-2">
                {smartHashtags.map((hashtag, index) => (
                  <button
                    key={index}
                    onClick={() => handleHashtagSelect(hashtag)}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {hashtag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category-based Hashtags */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">Browse by Category</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {hashtagCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory?.id === category.id ? null : category)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedCategory?.id === category.id
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-500">{category.count} hashtags</div>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium mb-3">{selectedCategory.name} Hashtags</h5>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.hashtags.map((hashtag, index) => (
                <button
                  key={index}
                  onClick={() => handleHashtagSelect(hashtag)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors"
                >
                  {hashtag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Hashtags */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">Add Custom Hashtags</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type hashtags separated by commas or spaces (e.g., photography, nature, art)"
            value={customHashtags}
            onChange={(e) => setCustomHashtags(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomHashtags()}
          />
          <button
            onClick={addCustomHashtags}
            disabled={!customHashtags.trim()}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected Hashtags */}
      {selectedHashtags.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Selected Hashtags ({selectedHashtags.length})</h4>
            <button
              onClick={() => setSelectedHashtags([])}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedHashtags.map((hashtag, index) => (
              <div
                key={index}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{hashtag}</span>
                <button
                  onClick={() => handleHashtagRemove(hashtag)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Copy hashtags for your posts:</p>
            <textarea
              readOnly
              className="w-full p-2 bg-white border border-gray-300 rounded text-sm"
              rows="3"
              value={selectedHashtags.join(' ')}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {/* Canvas for animated blobs */}
      <Canvas className="absolute inset-0 z-[-1]">
        <LightBlobs />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>

      {/* Navigation Header */}
      <div className="w-full fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-[1000]">
        <button 
          className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-200"
          onClick={handleBackClick}
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          <span className="text-gray-600">Back to Chat</span>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">Social Media Hub</h1>
          <p className="text-sm text-gray-600">Powered by Riona AI Agent</p>
        </div>
        <div className="w-32"></div>
      </div>

      <motion.section 
        className='mx-auto p-5 fixed inset-0 max-w-[1200px] overflow-hidden'
        {...headContainerAnimation}
        style={{ zIndex: 2, paddingTop: '5rem' }}
      >
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={slideAnimation}
          className="bg-white/90 backdrop-blur-sm rounded-lg border h-[80vh] flex flex-col"
        >
          {/* Tabs */}
          <div className="border-b flex space-x-1 p-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
              { id: 'accounts', label: 'Accounts', icon: UserGroupIcon },
              { id: 'hashtags', label: 'Hashtags', icon: HashtagIcon },
              { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  activeTab === tab.id 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'accounts' && renderAccounts()}
            {activeTab === 'hashtags' && renderHashtags()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default SocialMedia;