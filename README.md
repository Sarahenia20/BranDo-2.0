# BranDo-2.0 🚀

A comprehensive full-stack application combining 3D T-shirt customization, survey management system, and AI-powered social media automation with **Riona AI Agent**.

## 🌟 Overview

BranDo-2.0 is an innovative platform that brings together:
- **3D T-Shirt Customization**: Interactive 3D t-shirt designer with real-time customization
- **Survey Management System**: Complete survey creation and analysis platform  
- **Social Media Automation**: AI-powered automation with Riona AI Agent integration

## 📁 Project Structure

```
BranDoFullStack/
├── BranDo/                     # Frontend Application
│   ├── src/                    # React source code
│   ├── backend/                # Social Media Automation Backend
│   │   └── Riona-AI-Agent/     # AI Agent Integration
│   └── public/                 # Static assets
├── BranDo-Backend/             # Survey Management Backend (Laravel)
└── README.md                   # This file
```

## 🎯 Features

### Frontend (React + Vite)
- **3D T-Shirt Customizer**: Interactive 3D design tool built with Three.js and React Three Fiber
- **Survey Interface**: Complete survey creation, management, and response system
- **Social Media Dashboard**: Control panel for AI automation
- **Modern UI**: Built with Tailwind CSS and Framer Motion animations
- **Responsive Design**: Mobile-first approach with DaisyUI components

### Survey Backend (Laravel)
- **RESTful API**: Complete CRUD operations for surveys
- **Authentication**: Sanctum-based authentication system
- **Database**: MySQL with comprehensive migrations
- **File Management**: Image uploads and storage
- **Dashboard Analytics**: Survey response analytics

### Social Media Backend (Node.js)
- **AI Automation**: Powered by Riona AI Agent
- **Instagram Integration**: Automated posting, liking, and commenting
- **Google Generative AI**: AI-powered content generation
- **Account Management**: Multi-account support with settings
- **Real-time Status**: Live automation monitoring
- **MongoDB**: Data persistence for social media accounts

## 🤖 Riona AI Agent Integration

**Riona** is an AI-powered automation agent that handles social media interactions intelligently. Based on the [Riona-AI-Agent](https://github.com/David-patrick-chuks/Riona-AI-Agent) project, it provides:

- **Intelligent Automation**: AI-driven social media interactions
- **Content Generation**: Automated post creation using Google AI
- **Multi-Platform Support**: Instagram (with Twitter coming soon)
- **Personalization**: Trainable with custom content sources
- **Browser Automation**: Puppeteer-powered interactions
- **Proxy Support**: Multi-account management capabilities

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite
- **Three.js** & React Three Fiber for 3D graphics
- **Tailwind CSS** & DaisyUI for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API communication

### Backend - Survey System
- **Laravel 9+** PHP framework
- **MySQL** database
- **Laravel Sanctum** authentication
- **RESTful API** architecture

### Backend - Social Media
- **Node.js** & Express.js
- **MongoDB** with Mongoose ODM
- **Puppeteer** for browser automation
- **Google Generative AI** for content creation
- **Instagram Private API** integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PHP (v8.0+) & Composer
- MySQL database
- MongoDB

### Frontend Setup
```bash
cd BranDo
npm install
npm run dev
```

### Survey Backend Setup
```bash
cd BranDo-Backend
composer install
cp .env.example .env
# Configure database settings in .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Social Media Backend Setup
```bash
cd BranDo/backend
npm install
# Configure .env with MongoDB and Gemini API credentials
npm run dev
```

## 🔧 Environment Configuration

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SOCIAL_API_BASE_URL=http://localhost:5000
```

### Laravel Backend (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=brando_surveys
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Social Media Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brando-social
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

## 📱 Key Features Walkthrough

### 3D T-Shirt Customization
- Real-time 3D preview with Three.js
- Color customization with live preview
- Logo upload and positioning
- Export and download functionality

### Survey Management
- Create dynamic surveys with multiple question types
- Real-time response collection
- Dashboard analytics and insights
- Public survey sharing

### AI Social Media Automation
- Connect Instagram accounts securely
- AI-generated content with Gemini API
- Automated posting schedules
- Engagement automation (likes, comments)
- Real-time automation status monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Original Riona AI Agent**: [David-patrick-chuks/Riona-AI-Agent](https://github.com/David-patrick-chuks/Riona-AI-Agent)
- **Live Demo**: Coming Soon
- **Documentation**: Coming Soon

## 👨‍💻 Developer

Built with ❤️ during Summer Internship at Esprit

---

**BranDo-2.0** - Where 3D Design meets AI-Powered Social Media Automation 🎨🤖