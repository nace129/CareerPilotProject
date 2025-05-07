
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, MessageSquare, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Question {
  id: string;
  text: string;
  category: string;
}

const InterviewQuestionsPage = () => {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userAnswer, setUserAnswer] = useState<File | null>(null);
  const { toast } = useToast();

  // Handle job description upload
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

  // Handle user answer document upload
  const handleAnswerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserAnswer(file);
      toast({
        title: "Answer Document Uploaded",
        description: `File: ${file.name}`,
      });
    }
  };

  // Generate interview questions
  const generateQuestions = () => {
    if (!jobDescription && !targetRole.trim()) {
      toast({
        title: "Error",
        description: "Please upload a job description or enter a target role",
        variant: "destructive"
      });
      return;
    }

    // Simulate loading
    setIsGenerating(true);
    toast({
      title: "Generating Questions",
      description: "Please wait while we generate relevant interview questions...",
    });

    // Simulate API delay and response
    setTimeout(() => {
      // Sample questions based on common software engineering interview questions
      const mockQuestions: Question[] = [
        {
          id: "q1",
          text: "Can you walk me through your experience with front-end development frameworks?",
          category: "Technical Skills"
        },
        {
          id: "q2",
          text: "Describe a challenging project you worked on and how you overcame obstacles.",
          category: "Experience"
        },
        {
          id: "q3",
          text: "How do you approach debugging complex issues in your code?",
          category: "Problem Solving"
        },
        {
          id: "q4",
          text: "Can you explain your understanding of RESTful API design principles?",
          category: "Technical Knowledge"
        },
        {
          id: "q5",
          text: "How do you handle state management in large applications?",
          category: "Technical Skills"
        },
        {
          id: "q6",
          text: "Tell me about your experience with version control systems.",
          category: "Tools & Collaboration"
        },
        {
          id: "q7",
          text: "How do you stay updated with the latest web development trends?",
          category: "Professional Development"
        },
        {
          id: "q8",
          text: "What's your approach to writing maintainable code?",
          category: "Coding Practices"
        },
        {
          id: "q9",
          text: "How do you handle conflicting priorities or tight deadlines?",
          category: "Work Style"
        },
        {
          id: "q10",
          text: "Can you describe your ideal work environment?",
          category: "Culture Fit"
        }
      ];

      setQuestions(mockQuestions);
      setIsGenerating(false);
    }, 1500);
  };

  // Group questions by category
  const groupedQuestions: { [key: string]: Question[] } = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as { [key: string]: Question[] });

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Interview Question Generator</h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Job Description Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" size={20} />
                Upload Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="upload-area block cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all">
                {jobDescription ? (
                  <div className="text-green-600 flex flex-col items-center">
                    <FileText size={40} />
                    <span className="mt-2 font-medium">{jobDescription.name}</span>
                    <span className="text-sm text-gray-500">
                      {(jobDescription.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <Upload size={40} />
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
            </CardContent>
          </Card>

          {/* Target Role Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2" size={20} />
                Target Role/Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Enter the specific role you are targeting to generate tailored interview questions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate Questions Button */}
        <div className="text-center mb-10">
          <Button 
            onClick={generateQuestions}
            disabled={(!jobDescription && !targetRole.trim()) || isGenerating}
            className="font-semibold py-2 px-6"
          >
            {isGenerating ? "Generating Questions..." : "Generate Interview Questions"}
          </Button>
        </div>

        {/* Generated Questions Section */}
        {questions.length > 0 && (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-2xl font-semibold mb-2 text-center">Generated Interview Questions</h2>
            
            {/* Category-based Question Lists */}
            {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
              <Card key={category} className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="mr-2" size={18} />
                    {category} Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {categoryQuestions.map((question) => (
                      <li key={question.id} className="bg-gray-50 p-4 rounded-lg">
                        <p>{question.text}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
            
            {/* Answer Upload Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Upload Your Answers (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="upload-area block cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all">
                  {userAnswer ? (
                    <div className="text-green-600 flex flex-col items-center">
                      <FileText size={40} />
                      <span className="mt-2 font-medium">{userAnswer.name}</span>
                      <span className="text-sm text-gray-500">
                        {(userAnswer.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload size={40} />
                      <span className="mt-2 font-medium">Upload your answers document</span>
                      <span className="text-sm">
                        PDF, .doc/.docx, or .txt files only
                      </span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.txt" 
                    onChange={handleAnswerUpload}
                  />
                </label>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default InterviewQuestionsPage;
