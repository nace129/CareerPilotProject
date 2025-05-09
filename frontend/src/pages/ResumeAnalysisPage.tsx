
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, Check, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Define the structure for resume analysis results
interface ResumeAnalysis {
  summary: string | null;
  technical_skills: string[];
  soft_skills: string[];
  tools: string[];
  work_experience: {
    company: string;
    role: string;
    duration: string;
  }[];
  gaps: string[];
}

const ResumeAnalysisPage = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);


  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setResume(file);
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch("http://localhost:5000/upload-resume", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Resume upload failed");
  
      setSessionId(data.session_id);       // 🔑 Store session ID for later
      setResumeText(data.resume_text);     // Optional if needed for analysis
      if (!data.session_id) {
        throw new Error("No session ID returned from backend");
      }

      toast({
        title: "Resume Uploaded",
        description: `File: ${file.name}`
      });
  
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };      

  const analyzeResume = async () => {
    if (!sessionId || !resume) {
      toast({
        title: "Error",
        description: "Please upload a resume.",
        variant: "destructive"
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const res = await fetch("http://localhost:5000/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });      
      const data = await res.json();
      if (!res.ok || !data.analysis) throw new Error(data.error || "Analysis failed");
  
      {analysis ? (
        <div>show analysis...</div>
      ) : (
        <div className="text-center text-gray-500">No analysis yet</div>
      )}

      setAnalysis(data.analysis);
      toast({ title: "Success", description: "Resume analyzed successfully" });
      
      console.log("Analysis result:", data.analysis);
  
    } catch (err: any) {
      toast({
        title: "Analysis Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };      

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Resume Analysis</h1>
        
        <div className="max-w-4xl mx-auto">
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
                  accept=".pdf" 
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
                {/* Tech Skills Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.technical_skills.map((skill, index) => (
                      <span 
                        key={index} 
                        variant="secondary"
                        className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Soft Skills Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.soft_skills.map((skill, index) => (
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
                
                {/* Tools Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tools.map((skill, index) => (
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
                
                {/* Tools Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tools & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tools.map((tool, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Work Experience Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.work_experience.map((item, index) => (
                      <li key={index}>
                        <div>
                          <strong>Company:</strong> {item.company}
                        </div>
                        <div>
                          <strong>Role:</strong> {item.role}
                        </div>
                        <div>
                          <strong>Duration:</strong> {item.duration}
                        </div>
                      </li>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Gaps Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
                  <ul className="space-y-2">
                    {analysis.gaps.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <X size={16} className="mr-2 text-red-500 mt-1 flex-shrink-0" />
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
