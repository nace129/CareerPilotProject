
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Upload } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const InterviewPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Welcome to your interview! I'll ask you some questions based on the job description and your resume. Let's get started.", 
      isUser: false, 
      timestamp: new Date() 
    },
    { 
      text: "Tell me about your experience with ReactJS development.", 
      isUser: false,
      timestamp: new Date(Date.now() + 1000) 
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample interview questions
  const questions = [
    "How do you handle state management in large applications?",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "What strategies do you use for responsive web design?",
    "How do you approach debugging complex issues in your code?",
    "Tell me about your experience with version control systems.",
    "How do you stay updated with the latest web development trends?",
    "What's your approach to writing maintainable code?"
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      // Get a random question from the list
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      const aiMessage = {
        text: randomQuestion,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    // In a real application, this would handle audio recording
    setIsRecording(!isRecording);
    
    if (isRecording) {
      // Simulate end of recording and message
      setTimeout(() => {
        const userMessage = {
          text: "This is a transcription of my voice recording response to your question.",
          isUser: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        setTimeout(() => {
          const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
          
          const aiMessage = {
            text: randomQuestion,
            isUser: false,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
        }, 1500);
      }, 500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Simulate file upload as a message
      const userMessage = {
        text: `I've uploaded a file: ${file.name}`,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        const aiMessage = {
          text: randomQuestion,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }, 1500);
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
        <h1 className="text-3xl font-bold mb-4 text-center">Interview Session</h1>
        
        {/* Chat Container */}
        <div className="border rounded-lg bg-white shadow-sm overflow-hidden flex flex-col h-[70vh]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={message.isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
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
                placeholder="Type your answer..."
                className="flex-1"
              />
              
              <Button
                type="button"
                onClick={handleSendMessage}
                className="rounded-full px-3"
                disabled={!input.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Respond naturally to the questions as you would in a real interview.</p>
        </div>
      </div>
    </>
  );
};

export default InterviewPage;
