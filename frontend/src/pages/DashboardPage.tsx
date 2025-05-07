
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';

const DashboardPage = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock upload functions
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResume(file);
      toast({
        title: "Resume Uploaded",
        description: `File: ${file.name}`,
      });
    }
  };

  const handleJobDescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setJobDescription(file);
      toast({
        title: "Job Description Uploaded",
        description: `File: ${file.name}`,
      });
    }
  };

  // Mock analysis function
  const analyzeDocuments = () => {
    if (!resume || !jobDescription) {
      toast({
        title: "Error",
        description: "Please upload both your resume and the job description",
        variant: "destructive"
      });
      return;
    }

    // Simulate loading
    toast({
      title: "Analyzing Documents",
      description: "Please wait while we analyze your documents...",
    });

    // Simulate API delay and response
    setTimeout(() => {
      // Generate a random match score between 65 and 95
      const score = Math.floor(Math.random() * 31) + 65;
      setMatchScore(score);
      
      // Mock generated questions based on common interview questions
      const mockQuestions = [
        "Tell me about your experience with ReactJS development.",
        "How do you handle state management in large applications?",
        "Describe a challenging project you worked on and how you overcame obstacles.",
        "What strategies do you use for responsive web design?",
        "How do you approach debugging complex issues in your code?"
      ];
      
      setQuestions(mockQuestions);
    }, 1500);
  };

  // Start interview function
  const startInterview = () => {
    if (questions.length > 0) {
      navigate('/interview');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Interview Assistant Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resume Upload Section */}
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" size={20} />
              Upload Resume
            </h2>
            <label className="upload-area block">
              {resume ? (
                <div className="text-green-600 flex flex-col items-center">
                  <FileText size={48} />
                  <span className="mt-2 font-medium">{resume.name}</span>
                  <span className="text-sm text-gray-500">
                    {(resume.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Upload size={48} />
                  <span className="mt-2 font-medium">Upload your resume</span>
                  <span className="text-sm">
                    PDF, .doc/.docx, or .txt files only
                  </span>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt" 
                onChange={handleResumeUpload}
              />
            </label>
          </div>

          {/* Job Description Upload Section */}
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" size={20} />
              Upload Job Description
            </h2>
            <label className="upload-area block">
              {jobDescription ? (
                <div className="text-green-600 flex flex-col items-center">
                  <FileText size={48} />
                  <span className="mt-2 font-medium">{jobDescription.name}</span>
                  <span className="text-sm text-gray-500">
                    {(jobDescription.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Upload size={48} />
                  <span className="mt-2 font-medium">Upload job description</span>
                  <span className="text-sm">
                    PDF, .doc/.docx, or .txt files only
                  </span>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt" 
                onChange={handleJobDescriptionUpload}
              />
            </label>
          </div>
        </div>

        {/* Analysis Button */}
        <div className="text-center mb-10">
          <Button 
            onClick={analyzeDocuments}
            disabled={!resume || !jobDescription}
            className="font-semibold py-6 px-8 text-lg"
          >
            Analyze Documents
          </Button>
        </div>

        {/* Results Section */}
        {matchScore && (
          <div className="border rounded-lg p-6 bg-white shadow-sm mb-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center">Analysis Results</h2>
            
            {/* Match Score */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Resume Match Score</h3>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className={`h-6 rounded-full animated-gradient ${
                    matchScore >= 80 ? 'bg-green-600' : 
                    matchScore >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`} 
                  style={{ width: `${matchScore}%` }}
                ></div>
              </div>
              <p className="text-right font-bold mt-1">{matchScore}%</p>
            </div>
            
            {/* Generated Questions */}
            <div>
              <h3 className="text-lg font-medium mb-3">Generated Interview Questions</h3>
              <ul className="space-y-2 mb-6">
                {questions.map((question, index) => (
                  <li key={index} className="bg-gray-50 p-3 rounded-lg">
                    {index + 1}. {question}
                  </li>
                ))}
              </ul>
              
              <div className="text-center">
                <Button onClick={startInterview} className="flex items-center">
                  Start Interview
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
