# CareerPilot

##Project Demo
https://drive.google.com/file/d/1h6Vh4KMHrJBNatjAiiclVpT1Py6-i6mL/view?usp=sharing

## Abstract
With the increasing competitiveness in job markets, candidates often struggle to prepare effectively for interviews. CareerPilot is an AI-powered Automated Interview Preparation Assistant that personalizes interview questions, evaluates candidate responses, and provides real-time feedback on both technical and behavioral interviews.

The system leverages Natural Language Processing (NLP) and Speech Analysis to assess candidate answers, provide AI-generated model answers, and suggest improvements based on confidence, clarity, and relevance. The platform is hosted on AWS Cloud, ensuring scalability and availability. The AI model is trained on a large dataset of interview questions from LeetCode, Glassdoor, and real-world job postings, enabling it to generate role-specific interview questions and feedback.

CareerPilot is accessible via a web-based interface, allowing users to practice mock interviews with AI-generated questions and receive real-time voice & text-based feedback.

## Key Deliverables
- Fully functional web-based AI-powered Interview Assistant
- Personalized question generation & real-time AI feedback
- Speech-to-text transcription & sentiment analysis for behavioral interviews
- User authentication, interview history tracking, and analytics dashboard

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Features
- **AI-Powered Interview Practice**: Real-time mock interviews with personalized questions
- **Smart Feedback System**: Instant analysis of responses with improvement suggestions
- **Speech Analysis**: Voice-based interview practice with sentiment analysis
- **Progress Tracking**: Monitor interview performance and improvement over time
- **Role-Specific Preparation**: Customized questions based on job roles and requirements
- **Analytics Dashboard**: Detailed insights into interview performance and areas for improvement

## Tech Stack
- **Frontend**: React.js, TypeScript, CSS
- **Backend**: Python (Flask)
- **AI/ML**: Natural Language Processing, Speech Recognition
- **Database**: MongoDB
- **Cloud Services**: AWS (EC2, S3, Lambda)
- **Authentication**: JWT, OAuth2

## Project Structure
```
CareerPilot/
├── backend/
│   ├── app.py
│   ├── models/
│   ├── routes/
│   ├── ai_services/
│   │   ├── nlp_processor.py
│   │   ├── speech_analyzer.py
│   │   └── feedback_generator.py
│   └── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── ai/
│       └── App.tsx
├── deployment/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env
├── requirements.txt
└── README.md
```

### Backend (`backend/`)
Contains the Flask application and AI services:
- `app.py`: Entry point of the Flask app
- `models/`: Database models
- `routes/`: API route definitions
- `ai_services/`: AI and ML processing modules
- `utils/`: Helper functions and utilities

### Frontend (`frontend/`)
Contains the React application:
- `public/`: Static files
- `src/`: Source code
  - `components/`: Reusable UI components
  - `pages/`: Page-level components
  - `services/`: API service handlers
  - `ai/`: AI integration components
  - `App.tsx`: Main application component

### Requirements (`requirements.txt`)
Lists Python dependencies required for the backend.

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.x
- AWS CLI (for cloud deployment)
- Docker (optional, for containerized deployment)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/nace129/CareerPilot.git
cd CareerPilot
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
```

### Running the Application
1. Start the backend server:
```bash
cd ../backend
flask run
```

2. Start the frontend development server:
```bash
cd ../frontend
npm start
```

The application should now be running at http://localhost:3000.

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request
