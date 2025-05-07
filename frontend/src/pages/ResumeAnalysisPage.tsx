
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
  gaps: string[];
  soft_skills: string[];
  summary: string | null;
  technical_skills: string[];
  tools: string[];
  work_experience: Array<{
    role: string;
    company: string;
    duration: string;
    description?: string[];
  }>;
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

    // Mock API call with the provided JSON structure
    setTimeout(() => {
      // Mock analysis result based on the provided JSON structure
      const mockAnalysis: ResumeAnalysis = {
        gaps: [
          "No explicit experience with TypeScript",
          "No mention of vector databases",
          "Limited experience with generative AI",
          "Missing quantifiable achievements",
          "No resume summary section"
        ],
        soft_skills: [
          "Communication",
          "Teamwork",
          "Problem-solving",
          "Adaptability",
          "Time management",
          "Collaboration"
        ],
        summary: null,
        technical_skills: [
          "Python",
          "JavaScript",
          "SQL",
          "AWS",
          "Docker",
          "Kubernetes",
          "Machine Learning basics",
          "API development",
          "Git version control"
        ],
        tools: [
          "Visual Studio Code",
          "AWS Services (EC2, S3, Lambda)",
          "Docker",
          "Jenkins",
          "Linux",
          "IntelliJ",
          "GitHub",
          "Jira"
        ],
        work_experience: [
          {
            role: "Software Engineer",
            company: "TechCorp Inc.",
            duration: "Jun 2022 - Present",
            description: [
              "Developed and maintained web applications using JavaScript",
              "Implemented CI/CD pipelines with Jenkins",
              "Collaborated with cross-functional teams on project delivery"
            ]
          },
          {
            role: "Intern",
            company: "Techdefence Labs",
            duration: "Jan 2021 - May 2022",
            description: [
              "Assisted in security-related software development",
              "Learned cloud infrastructure and deployment",
              "Worked on data analysis using Python"
            ]
          }
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsLoading(false);
      
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your resume!",
      });
    }, 2000);
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
                {/* Summary Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  {analysis.summary ? (
                    <p>{analysis.summary}</p>
                  ) : (
                    <p className="text-amber-600">Resume summary not found.</p>
                  )}
                </div>
                
                <Separator />
                
                {/* Technical Skills Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.technical_skills.map((skill, index) => (
                      <Badge 
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
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
                      >
                        {skill}
                      </Badge>
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
                  <div className="space-y-4">
                    {analysis.work_experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-gray-300 pl-4 py-1">
                        <h4 className="font-semibold">{exp.role}</h4>
                        <div className="text-sm flex justify-between">
                          <span className="text-gray-700">{exp.company}</span>
                          <span className="text-gray-500">{exp.duration}</span>
                        </div>
                        {exp.description && (
                          <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                            {exp.description.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Gaps Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
                  <ul className="space-y-2">
                    {analysis.gaps.map((gap, index) => (
                      <li key={index} className="flex items-start">
                        <X size={16} className="mr-2 text-red-500 mt-1 flex-shrink-0" />
                        <span>{gap}</span>
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
