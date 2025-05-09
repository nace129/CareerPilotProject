// src/pages/InterviewPage.tsx
import React, { useState } from "react";
import { useNavigate }            from "react-router-dom";
import { Button }                 from "@/components/ui/button";
import { Input }                  from "@/components/ui/input";
import { Textarea }               from "@/components/ui/textarea";
import Navbar                     from "@/components/Navbar";
import { useToast }               from "@/components/ui/use-toast";

interface Question { id: string; text: string; }

export default function InterviewPage() {
  const [company, setCompany] = useState("");
  const [role,    setRole]    = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();
  const { toast }             = useToast();

  const handleStartInterview = async () => {
    const session_id = localStorage.getItem("session_id");
    if (!session_id) return toast({ title: "Missing session", variant: "destructive" });
    if (!company || !role) return toast({ title: "Enter company & role", variant: "destructive" });

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id, company, role_title: role })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate");

      const raw = json.questions.raw as string;
      // 🔥 Pull each numbered block including its sub-lines:
      const chunks: string[] = [];
      const re = /(\d+\.\s[\s\S]*?)(?=\n\d+\. |\z)/gm;
      let m: RegExpExecArray | null;
      while ((m = re.exec(raw))) {
        chunks.push(m[1].trim());
      }

      if (!chunks.length) {
        toast({ title: "No questions found", variant: "destructive" });
        return;
      }

      const questions: Question[] = chunks.map((t, i) => ({
        id: `q${i+1}`,
        text: t
      }));

      // persist for reload
      localStorage.setItem("interviewQuestions", JSON.stringify(questions));
      localStorage.setItem("interviewSession", session_id);

      navigate("/interview-questions", { state: { session_id, questions } });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Start Mock Interview</h1>
        <div className="space-y-4">
          <Input
            placeholder="Company name"
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
          <Input
            placeholder="Role title"
            value={role}
            onChange={e => setRole(e.target.value)}
          />
          <Textarea
            placeholder="Job Description (optional)"
            value={""}
            onChange={() => {}}
            rows={4}
            disabled
          />
          <Button onClick={handleStartInterview} disabled={loading} className="w-full">
            {loading ? "Generating…" : "Start Interview"}
          </Button>
        </div>
      </div>
    </>
  );
}
