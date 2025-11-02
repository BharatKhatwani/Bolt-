#  Bolt Clone - AI-Powered Website Builder

A full-stack web application that leverages AI to generate complete websites from natural language descriptions. Built with React, TypeScript, and powered by Google's Generative AI.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🌟 Features

- **AI-Powered Code Generation**: Generate complete websites using natural language prompts
- **Interactive Builder Interface**: Step-by-step website building process
- **File Explorer**: Navigate and edit generated project files
- **Live Preview**: See your website as it builds in real-time
- **Code Editor**: Monaco editor integration for code editing
- **Download Generated Projects**: Export your AI-generated website as a zip file
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **UI Components**: Custom components with Radix UI primitives
- **Code Editor**: Monaco Editor for syntax highlighting
- **File Management**: JSZip for generating downloadable project archives

### Backend (Express.js + TypeScript)
- **Framework**: Express.js with TypeScript
- **AI Integration**: Google Generative AI (@google/genai)
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Management**: dotenv for configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bolt-clone
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**
   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env file and add your Google AI API key
   # VITE_BACKEND_URL=http://localhost:3001
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure Frontend Environment**
   ```bash
   # Create .env.local file
   echo "VITE_BACKEND_URL=http://localhost:3001" > .env.local
   ```

6. **Start the Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
bolt-clone/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   │   ├── chat.ts     # Chat endpoint for AI conversations
│   │   │   └── template.ts # Template generation endpoint
│   │   ├── constants.ts    # Application constants
│   │   ├── prompt.ts       # AI prompt templates
│   │   └── index.ts        # Server entry point
│   ├── .env.example        # Environment variables template
│   └── package.json        # Backend dependencies
└── frontend/               # React application
    ├── src/
    │   ├── components/     # React components
    │   ├── Page/          # Page components (Home, Builder)
    │   ├── types/         # TypeScript type definitions
    │   └── config.ts      # Application configuration
    ├── public/            # Static assets
    └── package.json       # Frontend dependencies
```

## 🎯 Usage

1. **Navigate to the Home Page**
   - Enter a description of the website you want to build
   - Click "Generate Website Plan"

2. **Builder Interface**
   - View the step-by-step generation process
   - Explore generated files in the file explorer
   - Edit code in the integrated code editor
   - Preview your website in real-time

3. **Download Your Project**
   - Once all steps are completed, click "Download Zip File"
   - Extract and run the generated website locally

## 🔧 API Endpoints

### Backend API (`http://localhost:3001`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/template` | POST | Generate initial website template from prompt |
| `/chat` | POST | Continue conversation and generate code |

### Request Format
```json
{
  "prompt": "Create a portfolio website for a photographer"
}
```

### Response Format
```json
{
  "prompts": ["AI generated prompts..."],
  "uiPrompts": ["Step-by-step instructions..."]
}
```

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

**Backend:**
```bash
npm run build    # Compile TypeScript
npm run start    # Start production server
```

### Environment Variables

**Backend (.env):**
```env
# Google AI API Key (required)
GOOGLE_AI_API_KEY=your_api_key_here

# Server Configuration
PORT=3001
```

**Frontend (.env.local):**
```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3001
```

## 🌐 Technologies Used

### Frontend
- **React 19.1.1** - UI framework
- **TypeScript 5.9.2** - Type safety
- **Vite 7.1.7** - Build tool and dev server
- **Tailwind CSS 4.1.13** - Styling
- **Monaco Editor** - Code editing
- **JSZip** - File archiving
- **Axios** - HTTP client

### Backend
- **Express.js 5.1.0** - Web framework
- **TypeScript 5.9.2** - Type safety
- **Google Generative AI** - AI code generation
- **CORS** - Cross-origin support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Bolt](https://bolt.new) by StackBlitz
- Powered by [Google Generative AI](https://ai.google.dev/)
- Built with [React](https://react.dev/) and [node.js](https://nodejs.dev/)

##  Support

If you have any questions or need help, please open an issue on GitHub.

---


