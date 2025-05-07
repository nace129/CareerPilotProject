
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Upload, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  fileInfo?: {
    name: string;
    type: string;
    size: number;
  };
}

const InterviewPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1",
      text: "Welcome to your interview session! I'll ask you questions based on the job description. What position are you applying for?", 
      isUser: false, 
      timestamp: new Date() 
    }
  ]);
  
  const [input, setInput] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Sample interview questions based on common roles
  const questionsByRole: Record<string, string[]> = {
    "software engineer": [
      "What programming languages are you most proficient in?",
      "Describe a challenging project you worked on and how you overcame obstacles.",
      "How do you handle state management in large frontend applications?",
      "Explain your approach to writing maintainable and scalable code.",
      "How do you stay updated with the latest technologies in your field?"
    ],
    "product manager": [
      "How do you prioritize features for a product roadmap?",
      "Describe how you would gather and incorporate user feedback.",
      "Tell me about a time you had to make a difficult product decision.",
      "How do you collaborate with engineers and designers?",
      "What metrics do you use to measure product success?"
    ],
    "data scientist": [
      "Explain a complex data analysis you've performed.",
      "How do you approach feature engineering?",
      "What statistical methods do you commonly use?",
      "Describe your experience with machine learning algorithms.",
      "How do you communicate technical findings to non-technical stakeholders?"
    ],
    "default": [
      "Tell me about your relevant experience for this position.",
      "What are your greatest professional strengths?",
      "How do you handle challenges or setbacks?",
      "Describe your ideal work environment.",
      "Why are you interested in this role?"
    ]
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!isSetupCompleted) {
      // If setup is not completed, handle job description and title submission
      if (jobTitle.trim() === '') {
        toast({
          title: "Please enter a job title",
          description: "We need this to generate relevant questions.",
          variant: "destructive"
        });
        return;
      }
      
      // Add job details as user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        text: `I'm applying for a ${jobTitle} position${jobDescription ? '. Job Description: ' + jobDescription : ''}`,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Generate questions based on job title
      setTimeout(() => {
        const normalizedRole = jobTitle.toLowerCase();
        let roleQuestions = questionsByRole.default;
        
        // Try to find role-specific questions or use default
        for (const role in questionsByRole) {
          if (normalizedRole.includes(role)) {
            roleQuestions = questionsByRole[role];
            break;
          }
        }
        
        const firstQuestion = roleQuestions[0] || "Tell me about your experience.";
        
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          text: `Great! I'll be asking you questions for the ${jobTitle} position. Let's start: ${firstQuestion}`,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsSetupCompleted(true);
      }, 1000);
      
      setJobTitle('');
      setJobDescription('');
    } else {
      // Regular chat flow after setup
      if (input.trim() === '') return;
      
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        text: input,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      // Generate next question
      setTimeout(() => {
        // Get a random question from the relevant role list or default
        const normalizedRole = jobTitle.toLowerCase();
        let roleQuestions = questionsByRole.default;
        
        // Try to find role-specific questions or use default
        for (const role in questionsByRole) {
          if (normalizedRole.includes(role)) {
            roleQuestions = questionsByRole[role];
            break;
          }
        }
        
        const randomIndex = Math.floor(Math.random() * roleQuestions.length);
        const nextQuestion = roleQuestions[randomIndex];
        
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          text: nextQuestion,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (isRecording) {
      // Simulate end of recording and message
      setTimeout(() => {
        const userMessage: Message = {
          id: `voice-${Date.now()}`,
          text: "This is a transcription of my voice recording response to your question.",
          isUser: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // Generate next question
        setTimeout(() => {
          const normalizedRole = jobTitle.toLowerCase();
          let roleQuestions = questionsByRole.default;
          
          for (const role in questionsByRole) {
            if (normalizedRole.includes(role)) {
              roleQuestions = questionsByRole[role];
              break;
            }
          }
          
          const randomIndex = Math.floor(Math.random() * roleQuestions.length);
          const nextQuestion = roleQuestions[randomIndex];
          
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            text: nextQuestion,
            isUser: false,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
        }, 1000);
      }, 500);
    } else {
      toast({
        title: "Recording started",
        description: "Speak clearly and press the mic button again when finished.",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Add file as a message
      const userMessage: Message = {
        id: `file-${Date.now()}`,
        text: "I've uploaded a file with my response.",
        isUser: true,
        timestamp: new Date(),
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size
        }
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      
      // Generate next question after file upload
      setTimeout(() => {
        const normalizedRole = jobTitle.toLowerCase();
        let roleQuestions = questionsByRole.default;
        
        for (const role in questionsByRole) {
          if (normalizedRole.includes(role)) {
            roleQuestions = questionsByRole[role];
            break;
          }
        }
        
        const randomIndex = Math.floor(Math.random() * roleQuestions.length);
        const nextQuestion = roleQuestions[randomIndex];
        
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          text: nextQuestion,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }, 1500);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Format timestamp to only show time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Interview Questions</h1>
        
        {/* Setup Form (shown only initially) */}
        {!isSetupCompleted && (
          <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Interview Setup</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title/Role
                </label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer, Product Manager"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description (optional)
                </label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description here for more tailored questions..."
                  className="w-full"
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleSendMessage}
                className="w-full"
              >
                Start Interview
              </Button>
            </div>
          </div>
        )}
        
        {/* Chat Container */}
        <div className="border rounded-lg bg-white shadow-sm overflow-hidden flex flex-col h-[70vh]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.isUser 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.fileInfo ? (
                    <div className="flex items-center mb-2">
                      <FileText className="mr-2" size={16} />
                      <span className="text-sm">{message.fileInfo.name}</span>
                    </div>
                  ) : null}
                  <p>{message.text}</p>
                  <div className={`text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <label className="cursor-pointer">
                <div className="p-2 hover:bg-gray-100 rounded-full">
                  <Upload size={20} className="text-gray-600" />
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
              </label>
              
              <Button
                type="button"
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleRecording}
                className="rounded-full"
              >
                <Mic size={20} />
              </Button>
              
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isSetupCompleted ? "Type your answer..." : "Enter job title to start..."}
                className="flex-1"
                disabled={!isSetupCompleted && jobTitle.trim() === ''}
              />
              
              <Button
                type="button"
                onClick={handleSendMessage}
                className="rounded-full px-3"
                disabled={isSetupCompleted ? !input.trim() : !jobTitle.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewPage;
