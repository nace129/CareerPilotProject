
# AI-Powered Interview Assistant

## Project Description
A frontend web application built with ReactJS, designed to assist job seekers by analyzing resumes and job descriptions, generating a matching score, and providing interview questions based on the content.

## Features
- **Authentication System**
  - Login and Register functionality (UI only, no backend integration)
  - Form validation for username, email, and password fields

- **Dashboard**
  - Resume upload capability (PDF, DOC, or TXT format)
  - Job Description upload capability (PDF, DOC, or TXT format)
  - Match Score visualization after both files are uploaded
  - Generated interview questions display

- **Interview Interface**
  - Chatbot-style Q&A interface
  - Generated questions displayed as chat bubbles
  - User response input via text or file upload
  - Voice recording simulation

- **Profile Page**
  - User statistics visualization:
    - Number of interviews taken
    - Average match score
    - Total questions answered
    - Completion rate
  - Upload history display

## Tech Stack
- **ReactJS** (v18)
  - Functional components
  - React Hooks (useState, useEffect)
  - React Router for navigation
- **TypeScript**
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Query** for state management

## How to Run

```bash
# Clone the repository
git clone https://github.com/meghp73/career-pilot

# Navigate to project directory
cd career-pilot

# Install dependencies
npm install

# Start development server
npm run dev
```
