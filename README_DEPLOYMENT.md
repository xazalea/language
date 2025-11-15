# Azalea Web App Deployment Guide

## Overview

This is a complete web application for Azalea programming language, written entirely in Azalea. It includes:

- **Landing Page** (`/`) - Introduction to Azalea
- **Playground** (`/playground`) - Interactive code editor
- **Lessons** (`/lessons`) - Gamified learning system with 11 progressive lessons
- **AI Help** - Integrated llm7.io AI assistance

## Features

### Landing Page
- Beautiful hero section with gradient
- Feature cards highlighting Azalea's strengths
- Quick code example
- Navigation to playground and lessons

### Playground
- Split-screen code editor and output
- Run button to execute code
- AI help integration
- Navigation between sections

### Lessons
- 11 progressive lessons from beginner to professional
- XP and leveling system (50 XP per lesson, level up every 100 XP)
- Visual progress tracking
- AI help for each lesson
- Code examples and hints

### AI Integration
- Uses llm7.io API for AI assistance
- Available in both playground and lessons
- Context-aware help for learning Azalea

## File Structure

```
/
├── index.az          # Main server file with all routes and handlers
├── vercel.json       # Vercel deployment configuration
└── .gitattributes    # Git configuration for Azalea files
```

## Deployment to Vercel

### Prerequisites

1. Azalea runtime must be available (either WASM or native binary)
2. Vercel account
3. Vercel CLI installed (`npm i -g vercel`)

### Steps

1. **Build Azalea Runtime**
   ```bash
   make wasm  # For WebAssembly
   # OR
   make native  # For native binary
   ```

2. **Configure Vercel**
   - The `vercel.json` is already configured
   - You may need to adjust the build configuration based on your Azalea runtime setup

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Important Notes

- The application is written entirely in Azalea - no JavaScript/HTML dependencies
- All HTML is generated server-side by Azalea
- The server runs on port 3000 by default
- For Vercel, you may need to create a serverless function wrapper if Azalea runtime isn't directly supported

## Running Locally

```bash
# Build Azalea
make native

# Run the server
./bin/azalea index.az
```

The server will start on port 3000. Visit:
- http://localhost:3000/ - Landing page
- http://localhost:3000/playground - Playground
- http://localhost:3000/lessons - Lessons

## Routes

- `GET /` - Landing page
- `GET /playground` - Playground page
- `POST /playground` - Execute code (form submission)
- `GET /lessons` - Lessons page
- `POST /ai-help` - Get AI help
- `POST /complete-lesson` - Mark lesson as complete

## AI Integration

The AI help uses llm7.io API:
- Endpoint: `https://llm7.io/api/chat`
- Method: POST
- Provides context-aware help for learning Azalea

## State Management

Currently uses in-memory state. For production:
- Use a database for user progress
- Implement session management
- Store XP and level data persistently

## Future Enhancements

- Code execution in playground (requires Azalea runtime integration)
- User accounts and persistent progress
- More lessons (expandable to 20+)
- Badge/achievement system
- Social features (leaderboards, sharing)

## Troubleshooting

### Vercel Deployment Issues

If Vercel doesn't recognize Azalea files:
1. Ensure `.gitattributes` is committed
2. Check that `vercel.json` is properly configured
3. You may need a custom build script or serverless function wrapper

### AI Help Not Working

- Check llm7.io API availability
- Verify network requests are allowed
- Check API endpoint URL is correct

### Code Execution

- Full code execution requires Azalea runtime integration
- Currently shows placeholder output
- To enable: integrate Azalea WASM runtime in the server handlers

## License

MIT

