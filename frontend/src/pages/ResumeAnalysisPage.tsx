
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, Check, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Define the structure for resume analysis results
interface ResumeAnalysis {
  skills: string[];
  education: string[];
  experience: string[];
  weakAreas: string[];
  suggestions: string[];
}

const ResumeAnalysisPage = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { toast } = useToast();

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

  const analyzeResume = () => {
    if (!resume) {
      toast({
        title: "Error",
        description: "Please upload your resume first",
        variant: "destructive"
      });
      return;
    }

    // Simulate loading state
    setIsLoading(true);
    toast({
      title: "Analyzing Resume",
      description: "Please wait while we analyze your resume...",
    });

    // Mock API call - in a real implementation, this would send the file to a backend
    setTimeout(() => {
      // Mock analysis result
      const mockAnalysis: ResumeAnalysis = {
        skills: [
          "React", "TypeScript", "JavaScript", "HTML/CSS", 
          "Node.js", "Express", "MongoDB", "Git", 
          "RESTful APIs", "Agile Development"
        ],
        education: [
          "Bachelor's Degree in Computer Science, University of Technology (2018-2022)",
          "Full Stack Web Development Certification, CodeAcademy (2022)"
        ],
        experience: [
          "Frontend Developer at TechSolutions (2022-Present)",
          "Web Development Intern at StartupCo (2021)"
        ],
        weakAreas: [
          "Limited experience with cloud platforms (AWS, Azure)",
          "No mention of testing frameworks or methodologies",
          "Lacks evidence of team leadership or project management"
        ],
        suggestions: [
          "Add quantifiable achievements and impact metrics for each role",
          "Include specific examples of projects you've worked on",
          "Highlight any collaborative work or team contributions",
          "Consider adding relevant certifications to strengthen your profile"
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Resume Analysis</h1>
        
        <div className="max-w-3xl mx-auto">
          {/* Resume Upload Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" size={20} />
                Resume Upload
              </CardTitle>
              <CardDescription>
                Upload your resume to analyze your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <label className="cursor-pointer block border-2 border-dashed rounded-lg p-6 text-center">
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
              
              <div className="mt-6 text-center">
                <Button 
                  onClick={analyzeResume}
                  disabled={!resume || isLoading}
                  className="font-semibold"
                >
                  {isLoading ? "Analyzing..." : "Analyze Resume"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Analysis Results Section */}
          {analysis && (
            <Card className="mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle>Resume Analysis Results</CardTitle>
                <CardDescription>Based on your uploaded resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skills Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Education Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Education</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.education.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                {/* Experience Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.experience.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                {/* Weak Areas Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
                  <ul className="space-y-2">
                    {analysis.weakAreas.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <X size={16} className="mr-2 text-red-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                {/* Suggestions Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeAnalysisPage;
