
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
  rawContent?: string;
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
      // Mock response based on the provided JSON
      const mockRawContent = `Match Score: 75%

### Skill Match: 
- The candidate's technical skills align well with the job requirements. They have proficiency in Python, JavaScript, SQL, and knowledge of AI, which are essential for this role. Additionally, their experience with cloud technologies, such as AWS and Google Cloud Platform, is a strong advantage. 
- However, there is no explicit mention of experience with TypeScript, webhooks, vector databases, or data embeddings, which are required skills for the position. 

### Tools/Technologies Overlap: 
- The candidate's resume showcases a strong understanding of various tools and technologies. They have worked with AWS services (EC2, S3, Lambda, RDS), Docker, Kubernetes, and Jenkins, which are relevant to the job. 
- Additionally, their proficiency in Visual Studio, IntelliJ, VS Code, and Linux demonstrates a solid development foundation. 
- While the candidate doesn't explicitly mention experience with all the tools listed in the job description, their knowledge of similar tools and willingness to learn new ones (as evidenced by their work experience) could make up for this gap. 

### Past Experience Relevance: 
- The candidate's work experience as a Software Engineer and Intern shows their familiarity with software development and engineering practices. Their internship at Techdefence Labs, focusing on security, is particularly relevant to the Knowledge Ops role, indicating an understanding of operational aspects. 
- However, the resume lacks specific examples of integrating AI into solutions or working with generative AI technologies, which are key aspects of the Applied AI Intern role. 

### Culture Fit: 
- The candidate's soft skills, including collaboration, communication, teamwork, and agile development practices, align well with the culture fit requirements for this role. Their ability to work with cross-functional teams and adapt to new tools demonstrates a good cultural fit. 

### Gaps or Missing Elements: 
- The resume lacks a summary section, which could provide a quick overview of the candidate's skills and career goals. 
- While the work experience section is impressive, it could benefit from further quantification of accomplishments and a stronger emphasis on the impact of their contributions. This would help demonstrate the business value they can bring to DevRev. 

Overall, the candidate's resume shows a strong match in terms of technical skills, tools, and culture fit. However, there are some gaps in specific skill requirements, experience with generative AI, and the lack of a resume summary. Taking into account all the factors, the resume-to-job match score is 75%`;
      
      // Mock matched skills and gaps for the cards
      const matchedSkills = [
        "Python",
        "JavaScript",
        "SQL",
        "AI knowledge",
        "AWS",
        "Google Cloud Platform"
      ];
      
      const gaps = [
        "TypeScript",
        "Webhooks",
        "Vector databases",
        "Data embeddings",
        "Generative AI technologies"
      ];

      setAnalysisResult({
        matchScore: 75,
        matchedSkills,
        gaps,
        rawContent: mockRawContent
      });
      
      setIsAnalyzing(false);
    }, 1500);
  };

  const formatContent = (content: string) => {
    if (!content) return null;
    
    // Split by line breaks to handle each section
    const sections = content.split('\n\n');
    
    return (
      <div className="space-y-4">
        {sections.map((section, index) => {
          if (section.startsWith('###')) {
            // This is a header section
            const [header, ...contentLines] = section.split('\n');
            return (
              <div key={index} className="mt-6">
                <h3 className="text-xl font-bold text-primary">{header.replace('### ', '')}</h3>
                <div className="mt-2">
                  {contentLines.map((line, i) => (
                    <p key={i} className="py-1">
                      {line.startsWith('- ') ? (
                        <span className="flex">
                          <span className="mr-2">•</span>
                          <span>{line.substring(2)}</span>
                        </span>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </div>
            );
          } else if (section.startsWith('Match Score:')) {
            // This is the match score line
            return (
              <div key={index} className="text-center">
                <h2 className="text-3xl font-bold text-primary">{section}</h2>
              </div>
            );
          } else {
            // This is a regular paragraph
            return (
              <div key={index} className="my-4">
                {section.split('\n').map((line, i) => (
                  <p key={i} className="py-1">
                    {line.startsWith('- ') ? (
                      <span className="flex">
                        <span className="mr-2">•</span>
                        <span>{line.substring(2)}</span>
                      </span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            );
          }
        })}
      </div>
    );
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
          <div className="animate-fade-in space-y-6">
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
                <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                  <div 
                    className={`h-6 rounded-full ${
                      analysisResult.matchScore >= 80 ? 'bg-green-600' : 
                      analysisResult.matchScore >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`} 
                    style={{ width: `${analysisResult.matchScore}%` }}
                  ></div>
                </div>
                <p className="text-right font-bold">{analysisResult.matchScore}%</p>
              </CardContent>
            </Card>
            
            {/* Detailed Analysis Section */}
            {analysisResult.rawContent && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Detailed Analysis</CardTitle>
                  <CardDescription>Comprehensive review of how your resume matches the job description</CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  {formatContent(analysisResult.rawContent)}
                </CardContent>
              </Card>
            )}
            
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
