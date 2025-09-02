# AnuFrequency: Personal Frequency Studio

A modular frequency therapy lab for generating, testing, and saving sound-based frequencies with integrated light patterns and Fibonacci sequence tools. Built with React.js, Node.js/Express, and MongoDB.

## 🌟 Features

### Core Functionality
- **Frequency Generator**: Generate sine, square, sawtooth, and triangle waves (0.01Hz - 20kHz)
- **Light Patterns**: Canvas-based visual patterns synced to audio frequencies
- **Fibonacci Generator**: Mathematical sequence-based frequency generation
- **Presets Library**: 40+ research-based frequency presets
- **Session Logging**: Track and analyze your frequency therapy sessions
- **User Authentication**: JWT-based login system with profile management

### Research-Based Presets
- **Solfeggio Frequencies**: 174Hz, 285Hz, 396Hz, 417Hz, 528Hz, 639Hz, 741Hz, 852Hz, 963Hz
- **Brainwave Entrainment**: Alpha (10Hz), Beta (20Hz), Theta (4Hz), Delta (0.5Hz), Gamma (40Hz)
- **Schumann Resonance**: 7.83Hz Earth frequency
- **Chakra Frequencies**: Root (256Hz) to Crown (480Hz)
- **Rife Frequencies**: Pain relief and healing frequencies
- **Binaural Beats**: Alpha and Theta entrainment
- **Chromotherapy**: Red, blue, green light therapy simulations

### Advanced Features
- **Binaural Mode**: Left/right ear frequency offset
- **Audio Visualization**: Real-time spectrum analyzer and waveform display
- **Modular Plugin System**: Extensible architecture for future enhancements
- **PWA Support**: Offline functionality and mobile app-like experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/anu-frequency-studio.git
   cd anu-frequency-studio
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   
   # Edit server/.env with your MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/anu-frequency
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Seed the database with presets**
   ```bash
   cd server
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Seed the database**
   ```bash
   docker-compose exec server npm run seed
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

### Individual Docker Services

```bash
# Build and run MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:7.0

# Build and run server
cd server
docker build -t anu-frequency-server .
docker run -d --name server -p 5000:5000 --link mongodb anu-frequency-server

# Build and run client
cd client
docker build -t anu-frequency-client .
docker run -d --name client -p 3000:3000 --link server anu-frequency-client
```

## 🌐 Production Deployment

### Vercel (Frontend + Serverless API)

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy frontend
   cd client
   vercel --prod
   
   # Deploy serverless API
   cd ../server
   vercel --prod
   ```

2. **Environment Variables in Vercel**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secure random string
   - `FRONTEND_URL`: Your deployed frontend URL

### Render (Backend)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Set environment variables**:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### MongoDB Atlas (Database)

1. **Create a MongoDB Atlas account**
2. **Create a new cluster**
3. **Get your connection string**
4. **Update your environment variables**

## 📱 PWA Features

The application includes Progressive Web App capabilities:

- **Offline Support**: Cache presets and core functionality
- **Install Prompt**: Add to home screen on mobile devices
- **Background Sync**: Sync session data when connection is restored
- **Push Notifications**: Session reminders and updates

## 🔧 Development

### Project Structure

```
anu-frequency-studio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, Audio, etc.)
│   │   ├── pages/          # Page components
│   │   ├── plugins/        # Plugin system
│   │   └── services/       # API services
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── seed.js             # Database seeding
└── docker-compose.yml      # Docker configuration
```

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run server           # Start backend only
npm run client           # Start frontend only

# Database
npm run seed             # Seed database with presets

# Production
npm run build            # Build frontend for production
npm start                # Start production server
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Presets
- `GET /api/presets` - Get presets (public + user's)
- `POST /api/presets` - Create new preset
- `GET /api/presets/:id` - Get specific preset
- `PUT /api/presets/:id` - Update preset
- `DELETE /api/presets/:id` - Delete preset

#### Sessions
- `POST /api/sessions` - Start new session
- `GET /api/sessions` - Get user sessions
- `PUT /api/sessions/:id/end` - End session
- `POST /api/sessions/:id/feedback` - Add session feedback

## 🔌 Plugin System

The application includes a modular plugin system for extending functionality:

### Core Plugins
- **LightPatterns**: Canvas-based light pattern generation
- **FibonacciGenerator**: Mathematical sequence generation

### Future Plugins (Stubs)
- **AIOptimizer**: AI-powered frequency optimization
- **VRModule**: VR light immersion
- **HardwareInterface**: External device integration
- **Biofeedback**: Real-time biofeedback

### Creating Custom Plugins

```javascript
// plugins/MyPlugin.js
export const MyPlugin = {
  name: 'MyPlugin',
  version: '1.0.0',
  description: 'My custom plugin',
  category: 'custom',
  
  initialize: async () => {
    console.log('My plugin initialized');
    return true;
  },
  
  // Plugin functionality here
};
```

## 🧪 Research & Science

This application is based on research in:

- **Sound Healing**: Solfeggio frequencies, binaural beats
- **Brainwave Entrainment**: Alpha, beta, theta, delta, gamma waves
- **Light Therapy**: Chromotherapy, AVE (Audio-Visual Entrainment)
- **Mathematical Harmonics**: Fibonacci sequences, golden ratio
- **Bioresonance**: Rife frequencies, cellular healing

### Disclaimer

This application is for personal experimentation and research purposes. It is not intended to diagnose, treat, cure, or prevent any medical condition. Always consult with healthcare professionals for medical advice.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Research on Solfeggio frequencies and sound healing
- Brainwave entrainment studies
- Fibonacci sequence and golden ratio mathematics
- Web Audio API and Canvas API documentation
- React, Node.js, and MongoDB communities

## 📞 Support

For support, email support@anufrequency.com or join our Discord community.

---

**AnuFrequency Studio** - Harness the power of sound and light for healing and transformation.