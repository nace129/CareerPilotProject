
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, BarChart } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  gaps: string[];
}

const DashboardPage = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Handle resume upload
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
    setIsAnalyzing(true);
    toast({
      title: "Analyzing Documents",
      description: "Please wait while we analyze your documents...",
    });

    // Simulate API delay and response
    setTimeout(() => {
      // Generate a random match score between 65 and 95
      const score = Math.floor(Math.random() * 31) + 65;
      
      // Mock matched skills
      const matchedSkills = [
        "React.js",
        "TypeScript",
        "Frontend Development",
        "UI/UX Design",
        "RESTful APIs"
      ];
      
      // Mock gaps/missing areas
      const gaps = [
        "Experience with GraphQL",
        "Unit testing frameworks",
        "CI/CD pipeline knowledge",
        "Docker containerization"
      ];

      setAnalysisResult({
        matchScore: score,
        matchedSkills,
        gaps
      });
      
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Resume & Job Match Analysis</h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resume Upload Section */}
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" size={20} />
              Upload Resume
            </h2>
            <label className="upload-area block cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-all">
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
            <label className="upload-area block cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-all">
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
            disabled={!resume || !jobDescription || isAnalyzing}
            className="font-semibold py-6 px-8 text-lg"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Documents"}
          </Button>
        </div>

        {/* Results Section */}
        {analysisResult && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center">Analysis Results</h2>
            
            {/* Match Score Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2" size={20} />
                  Resume Match Score
                </CardTitle>
                <CardDescription>How well your resume matches the job requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className={`h-6 rounded-full ${
                      analysisResult.matchScore >= 80 ? 'bg-green-600' : 
                      analysisResult.matchScore >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`} 
                    style={{ width: `${analysisResult.matchScore}%` }}
                  ></div>
                </div>
                <p className="text-right font-bold mt-1">{analysisResult.matchScore}%</p>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Matched Skills Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Matched Skills</CardTitle>
                  <CardDescription>Skills that align with the job requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.matchedSkills.map((skill, index) => (
                      <li key={index} className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Gaps/Missing Areas Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills Gaps</CardTitle>
                  <CardDescription>Areas to improve based on job requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.gaps.map((gap, index) => (
                      <li key={index} className="flex items-center">
                        <span className="h-2 w-2 bg-orange-500 rounded-full mr-2"></span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
