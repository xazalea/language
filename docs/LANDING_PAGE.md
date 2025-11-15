# Azalea Landing Page + Playground + Learning System

This document describes the comprehensive landing page, playground, and gamified learning system created for Azalea.

## Overview

The `azalea_landing.az` file contains a complete single-page application with three main sections:

1. **Landing Page** - Beautiful introduction to Azalea
2. **Playground** - Interactive code editor and runner
3. **Lessons** - Gamified learning system with progressive difficulty

## Features

### Landing Page
- Hero section with gradient background
- Feature cards highlighting Azalea's strengths
- Quick code example
- Navigation to playground and lessons

### Playground
- Split-screen code editor and output
- Run button to execute code
- Navigation between sections
- Default example code

### Gamified Learning System
- **XP System**: Earn 50 XP per completed lesson
- **Leveling**: Level up every 100 XP
- **Progressive Lessons**: 11 lessons from beginner to professional
- **Smart Pacing**: Lessons increase in difficulty gradually
- **Visual Progress**: See your level and XP in the header
- **Lesson Navigation**: Sidebar with all lessons, current lesson highlighted

## Lesson Structure

Each lesson includes:
- **Title**: Clear lesson name
- **Goal**: What you need to accomplish
- **Code Example**: Working code to learn from
- **Hint**: Helpful tip to guide you
- **Try in Playground**: Button to load code into playground
- **Mark Complete**: Button to complete lesson and earn XP

## Lesson Progression

1. **Hello World** (Beginner) - Print your first message
2. **Variables** (Beginner) - Create and use variables
3. **Math Operations** (Beginner) - Do math with numbers
4. **Conditionals** (Beginner) - Make decisions with if statements
5. **Loops** (Beginner) - Repeat actions
6. **Functions** (Intermediate) - Create reusable functions
7. **Lists** (Intermediate) - Work with collections
8. **UI Components** (Intermediate) - Create user interfaces
9. **Styling** (Intermediate) - Style with CSS
10. **Forms** (Intermediate) - Create input forms
11. **Advanced Functions** (Advanced) - Complex function patterns

## Gamification Elements

- **XP Points**: Earn experience points for completing lessons
- **Levels**: Progress through levels as you learn
- **Visual Feedback**: See your progress in real-time
- **Achievement System**: Ready for badge/achievement expansion

## Usage

To use this application:

1. Load `azalea_landing.az` in the Azalea interpreter
2. The app will render the landing page by default
3. Navigate between sections using the buttons
4. In the lessons section, click on lessons in the sidebar
5. Try code in the playground
6. Mark lessons as complete to earn XP

## Technical Details

### State Management
The app uses global variables for state:
- `current_section`: Which section is displayed (landing/playground/lessons)
- `user_level`: Current user level
- `user_xp`: Current XP points
- `current_lesson`: Currently selected lesson (0-10)
- `editor_code`: Code in the editor
- `output_text`: Output from code execution

### Navigation
The `navigate` function switches between sections and re-renders the app.

### XP System
- `add_xp` function adds XP and checks for level ups
- Level up occurs every 100 XP
- `complete_current_lesson` awards 50 XP and advances to next lesson

## Future Enhancements

Potential additions:
- Badge system for achievements
- More lessons (currently 11, can expand to 20+)
- Code validation/checking
- Save progress to localStorage
- Social features (leaderboards, sharing)
- More advanced topics (networking, file I/O, servers)

## File Structure

- `examples/azalea_landing.az` - Main application file
- `.gitattributes` - Git configuration for Azalea files

## Notes

- The app is written entirely in Azalea
- Uses Azalea's view system for UI components
- Full CSS support for styling
- Responsive design with grid and flexbox
- Modern gradient backgrounds and card layouts

