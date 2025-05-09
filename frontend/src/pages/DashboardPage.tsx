// src/pages/DashboardPage.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, BarChart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface ApiMatchScore {
  match_score: {
    raw: string;
    error?: string;
  };
  session_id: string;
}

interface AnalysisResult {
  matchScore: number;
  rawContent: string;
  matchedSkills: string[];
  gaps: string[];
}

export default function DashboardPage() {
  const [resume, setResume] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [loadingResume, setLoadingResume] = useState(false);
  const [loadingJd, setLoadingJd] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const { toast } = useToast();

  // helper to extract bullet points under a ### header
  const extractSection = (raw: string, header: string) => {
    const parts = raw.split(`### ${header}`);
    if (parts.length < 2) return [];
    return parts[1]
      .split("###")[0]
      .split("\n")
      .filter((l) => l.trim().startsWith("- "))
      .map((l) => l.replace(/^- /, "").trim());
  };

  // 1️⃣ Upload & analyze resume
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResume(file);
    setLoadingResume(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/dashboard-upload-resume", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to upload resume");
      setSessionId(json.session_id);
      //after you setSessionId(json.session_id);
      localStorage.setItem("session_id", json.session_id);
      toast({ title: "✅ Resume saved & analyzed" });
    } catch (err: any) {
      toast({
        title: "Upload Error",
        description: err.message,
        variant: "destructive",
      });
      setResume(null);
    } finally {
      setLoadingResume(false);
    }
  };

  // 2️⃣ Upload & analyze JD
  const handleJdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Please upload your resume first.",
        variant: "destructive",
      });
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    setJdFile(file);
    setLoadingJd(true);

    const text = await file.text();
    try {
      const res = await fetch("http://localhost:5000/dashboard-upload-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, jd_text: text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to upload JD");
      toast({ title: "✅ JD saved & analyzed" });
    } catch (err: any) {
      toast({
        title: "JD Upload Error",
        description: err.message,
        variant: "destructive",
      });
      setJdFile(null);
    } finally {
      setLoadingJd(false);
    }
  };

  // 3️⃣ Fetch match-score
  const analyzeDocuments = async () => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Missing session ID",
        variant: "destructive",
      });
      return;
    }
    setLoadingMatch(true);

    try {
      const res = await fetch("http://localhost:5000/match-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const json: ApiMatchScore = await res.json();
      if (!res.ok) throw new Error(json.match_score.error || "Match-score failed");

      const raw = json.match_score.raw;
      // extract percentage
      const pctMatch = parseInt((raw.match(/Match Score:\s*(\d+)%/) || [])[1] || "0", 10);

      // extract sections
      const matchedSkills = extractSection(raw, "Skill Match:");
      const gaps = extractSection(raw, "Gaps or Missing Elements:");

      setAnalysisResult({
        matchScore: pctMatch,
        rawContent: raw,
        matchedSkills,
        gaps,
      });
      toast({ title: "✅ Analysis complete" });
    } catch (err: any) {
      toast({
        title: "Analysis Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingMatch(false);
    }
  };

  // custom renderer: bold headers & bullet each sentence
  const renderDetailed = (raw: string) => {
    // split by section
    const sections = raw.split("\n\n### ");
    return sections.map((sec, i) => {
      // first section starts with "Match Score:"
      if (i === 0) {
        return (
          <div key={i} className="mb-4">
            <strong>Match Score:</strong> {sec.split("\n")[0]}
          </div>
        );
      }
      // others: header: content
      const [headerLine, ...restLines] = sec.split("\n");
      const header = headerLine.replace(/^### /, "");
      // join rest
      const content = restLines.join(" ").trim();
      // if already has bullets, keep
      if (content.startsWith("- ")) {
        return (
          <div key={i} className="mb-4">
            <strong>{header}</strong>
            <ul className="list-disc ml-6 mt-2">
              {content
                .split("\n")
                .filter((l) => l.startsWith("- "))
                .map((l, idx) => (
                  <li key={idx}>{l.replace(/^- /, "")}</li>
                ))}
            </ul>
          </div>
        );
      }
      // else split sentences into bullets
      const sentences = content.split(". ").filter((s) => s.trim());
      return (
        <div key={i} className="mb-4">
          <strong>{header}</strong>
          <ul className="list-disc ml-6 mt-2">
            {sentences.map((s, idx) => (
              <li key={idx}>{s.endsWith(".") ? s : s + "."}</li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Resume & Job Match Analysis
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" /> Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <label className="cursor-pointer border-2 border-dashed rounded-lg p-6 inline-block w-full">
                {resume ? resume.name : <span className="text-gray-500">Click to upload PDF</span>}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  disabled={loadingResume}
                  onChange={handleResumeUpload}
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" /> Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <label className="cursor-pointer border-2 border-dashed rounded-lg p-6 inline-block w-full">
                {jdFile ? jdFile.name : <span className="text-gray-500">Click to upload .txt</span>}
                <input
                  type="file"
                  accept=".txt"
                  className="hidden"
                  disabled={!sessionId || loadingJd}
                  onChange={handleJdUpload}
                />
              </label>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-10">
          <Button onClick={analyzeDocuments} disabled={!sessionId || loadingMatch}>
            {loadingMatch ? "Analyzing…" : "Analyze Documents"}
          </Button>
        </div>

        {analysisResult && (
          <div className="space-y-6">
            {/* Match % Gauge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2" /> Match Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 h-4 rounded-full mb-2">
                  <div
                    className={`h-4 rounded-full ${
                      analysisResult.matchScore >= 80
                        ? "bg-green-600"
                        : analysisResult.matchScore >= 70
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${analysisResult.matchScore}%` }}
                  />
                </div>
                <p className="text-right font-bold">{analysisResult.matchScore}%</p>
              </CardContent>
            </Card>

            {/* Detailed Analysis in bold headers + bullets */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>
                  Breakdown of how your resume aligns (and where gaps are)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderDetailed(analysisResult.rawContent)}
              </CardContent>
            </Card>

            {/* Matched Skills & Gaps */}
            {/* <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Matched Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-6">
                    {analysisResult.matchedSkills.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills Gaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-6">
                    {analysisResult.gaps.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div> */}
          </div>
        )}
      </div>
    </>
  );
}
