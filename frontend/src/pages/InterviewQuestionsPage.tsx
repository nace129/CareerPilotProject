// src/pages/InterviewQuestionsPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Mic } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";

interface Question {
  id: string;
  text: string;
}
interface LocationState {
  session_id: string;
  questions: Question[];
}
// feedback shape coming back from your new audio_feedback.py
interface Feedback {
  strengths: string[];
  improvements: string[];
  score: number;
}

const InterviewQuestionsPage = () => {
  const { state } = useLocation() as { state?: LocationState };
  
  const toast = useToast().toast;

  if (!state || !state.questions) {
    return (
      <p className="text-center mt-8 text-red-500">
        No interview data—did you navigate here correctly?
      </p>
    );
  }

  const { session_id, questions } = state;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [recording, setRecording] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showNextBtn, setShowNextBtn] = useState(false);

  useEffect(() => {
    if (!session_id) {
      toast({ title: "Error", description: "Missing interview session.", variant: "destructive" });
    }
  }, [session_id, toast]);

  const handleSubmit = async () => {
    if (!recording) {
      return toast({ title: "Error", description: "Please upload your answer audio.", variant: "destructive" });
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("session_id", session_id);
      form.append("question_id", questions[currentIdx].id);
      form.append("file", recording);

      const res = await fetch("http://localhost:5000/submit-answer", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit answer");

      // this is now an object
      setFeedback(json.feedback);
      setShowNextBtn(true);
      setRecording(null);

      // advance after short pause
      if (currentIdx < questions.length - 1) {
        setTimeout(() => {
          setCurrentIdx((idx) => idx + 1);
          setFeedback(null);
        }, 2000);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIdx(idx => idx + 1);
    setFeedback(null);
    setShowNextBtn(false);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Mock Interview</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded">
          <p className="font-semibold">
            Question {currentIdx + 1} of {questions.length}
          </p>
          <p className="mt-2">{questions[currentIdx].text}</p>
        </div>

        {/* Feedback block */}
        {feedback && (
    <div className="mb-6 p-4 bg-green-50 border rounded">
            <h2 className="font-semibold mb-2">Feedback</h2>
            <p className="font-bold mb-2">Score: {feedback.score}%</p>

            <div className="mb-2">
              <h3 className="font-semibold">Strengths</h3>
              <ul className="list-disc ml-6">
                {feedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Improvements</h3>
              <ul className="list-disc ml-6">
                {feedback.improvements.map((i, j) => (
                  <li key={j}>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Audio upload + submit */}
      
        <div className="flex items-center space-x-4 mb-6">
          <label className="cursor-pointer">
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload size={20} />
            </div>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setRecording(f);
              }}
            />
          </label>
          {recording && <span>{recording.name}</span>}
        </div>

        <Button
        onClick={handleSubmit}
          disabled={loading || !recording || showNextBtn} >
          {loading ? "Submitting…" : "Submit Answer"}
        </Button>
      </div>
    </>
  );
};

export default InterviewQuestionsPage;

// // src/pages/InterviewQuestionsPage.tsx
// // src/pages/InterviewQuestionsPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate }             from "react-router-dom";
import { Button }                                from "@/components/ui/button";
import Navbar                                    from "@/components/Navbar";
import { useToast }                              from "@/components/ui/use-toast";
import ReactMarkdown                             from "react-markdown";

interface Question { id: string; text: string; }
interface LocationState { session_id: string; questions: Question[]; }

export default function InterviewQuestionsPage() {
  const { state } = useLocation() as { state?: LocationState };
  const navigate  = useNavigate();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [current, setCurrent]     = useState(0);
  const [file, setFile]           = useState<File|null>(null);
  const [feedback, setFeedback]   = useState<string>("");
  const [loading, setLoading]     = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // fallback to localStorage
    let qs = state?.questions;
    let sid = state?.session_id;
    if (!qs) {
      qs  = JSON.parse(localStorage.getItem("interviewQuestions") || "[]");
      sid = localStorage.getItem("interviewSession") || "";
    }
    if (!qs.length || !sid) {
      toast({ title: "No interview data", variant: "destructive" });
      return navigate("/interview", { replace: true });
    }
    setQuestions(qs);
    setSessionId(sid);
  }, []);

  if (!questions.length) return null;

  const handleSubmit = async () => {
    if (!file) {
      return toast({ title: "Upload your audio first", variant: "destructive" });
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("session_id",  sessionId);
      form.append("question_id", questions[current].id);
      form.append("file",        file);

      const res = await fetch("http://localhost:5000/submit-answer", {
        method: "POST",
        body: form
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");

      setFeedback(json.feedback);
      setFile(null);

    } catch(err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setFeedback("");
      setCurrent(i => i + 1);
    } else {
      toast({ title: "Interview Complete", description: "You've answered all questions!" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Mock Interview</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded">
          <p className="font-semibold">
            Question {current + 1} of {questions.length}
          </p>
          <div className="mt-2 prose">
            <ReactMarkdown>{questions[current].text}</ReactMarkdown>
          </div>
        </div>

        {feedback && (
          <div className="mb-6 p-4 bg-green-50 border-green-200 rounded">
            <h2 className="font-semibold mb-2">Feedback</h2>
            <p>{feedback}</p>
          </div>
        )}

        <div className="flex items-center mb-6 space-x-4">
          <button
            onClick={() => fileInput.current?.click()}
            className="p-3 bg-gray-100 rounded-full"
          >
            Upload Answer 🎤
          </button>
          {file && <span>{file.name}</span>}
          <input
            ref={fileInput}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSubmit} disabled={loading || !file} className="flex-1">
            {loading ? "Submitting…" : "Submit Answer"}
          </Button>
          <Button onClick={nextQuestion} disabled={loading} variant="outline" className="flex-1">
            Next Question
          </Button>
        </div>
      </div>
    </>
  );
}




// src/pages/InterviewQuestionsPage.tsx
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Upload, Mic } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import { useToast } from "@/components/ui/use-toast";

// interface Question { id: string; text: string; }
// interface LocationState {
//   session_id: string;
//   questions: Question[];
// }

// const InterviewQuestionsPage: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const state: LocationState = (location.state as LocationState) || { session_id: "", questions: [] };
//   const { session_id, questions } = state;

//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [recording, setRecording] = useState<File | null>(null);
//   const [feedback, setFeedback] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();

//   // If we navigated here incorrectly, bail
//   if (!session_id || !questions?.length) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <p className="text-red-500">
//           No interview session found. Please go back and start a new interview.
//         </p>
//         <Button onClick={() => navigate("/interview")}>Back to Setup</Button>
//       </div>
//     );
//   }

//   const handleSubmitAnswer = async () => {
//     if (!recording) {
//       toast({ title: "Missing file", description: "Please upload your audio answer", variant: "destructive" });
//       return;
//     }
//     setLoading(true);
//     try {
//       const form = new FormData();
//       form.append("session_id", session_id);
//       form.append("question_id", questions[currentIdx].id);
//       form.append("file", recording);

//       const res = await fetch("http://localhost:5000/submit-answer", {
//         method: "POST",
//         body: form,
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json.error || "Submit failed");

//       setFeedback(json.feedback);
//       setRecording(null);

//       // Advance to next question after a short pause
//       if (currentIdx < questions.length - 1) {
//         setTimeout(() => {
//           setCurrentIdx((i) => i + 1);
//           setFeedback("");
//         }, 2000);
//       }

//     } catch (err: any) {
//       toast({ title: "Error", description: err.message, variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto px-4 py-8 max-w-2xl">
//         <h1 className="text-2xl font-bold mb-4">Mock Interview</h1>

//         <div className="mb-6 p-4 bg-gray-50 rounded">
//           <p className="font-semibold">
//             Question {currentIdx + 1} of {questions.length}
//           </p>
//           <p className="mt-2">{questions[currentIdx].text}</p>
//         </div>

//         {feedback && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
//             <h2 className="font-semibold mb-2">Feedback</h2>
//             <p>{feedback}</p>
//           </div>
//         )}

//         <div className="flex items-center space-x-4 mb-6">
//           <label className="cursor-pointer">
//             <div className="p-3 bg-gray-100 rounded-full">
//               <Upload size={20} />
//             </div>
//             <input
//               type="file"
//               accept="audio/*"
//               className="hidden"
//               onChange={(e) => {
//                 const f = e.target.files?.[0];
//                 if (f) setRecording(f);
//               }}
//             />
//           </label>
//           {recording && <span>{recording.name}</span>}
//         </div>

//         <Button onClick={handleSubmitAnswer} disabled={loading || !recording}>
//           {loading ? "Submitting…" : "Submit Answer"}
//         </Button>
//       </div>
//     </>
//   );
// };

// export default InterviewQuestionsPage;




// // import React, { useState, useEffect } from 'react';
// // import { Button } from "@/components/ui/button";
// // import { Upload, FileText, MessageSquare, Search } from 'lucide-react';
// // import { useToast } from "@/components/ui/use-toast";
// // import Navbar from '@/components/Navbar';
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Separator } from "@/components/ui/separator";

// // interface Question {
// //   id: string;
// //   text: string;
// //   category: string;
// // }

// // const API_BASE = 'http://localhost:5000';

// // const InterviewQuestionsPage: React.FC = () => {
// //   const [jdFile, setJdFile] = useState<File | null>(null);
// //   const [role, setRole] = useState<string>('');
// //   const [questions, setQuestions] = useState<Question[]>([]);
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [sessionId, setSessionId] = useState<string | null>(null);
// //   const { toast } = useToast();

// //   // Load any existing session_id
// //   useEffect(() => {
// //     const sid = localStorage.getItem('session_id');
// //     if (sid) setSessionId(sid);
// //   }, []);

// //   // 1️⃣ Upload JD file & get a fresh session_id
// //   const handleJdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;
// //     setJdFile(file);

// //     const form = new FormData();
// //     form.append('jd', file);

// //     try {
// //       const res = await fetch(`${API_BASE}/upload-jd`, {
// //         method: 'POST',
// //         body: form,
// //         credentials: 'include'
// //       });
// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.error || data.message || 'Upload failed');

// //       localStorage.setItem('session_id', data.session_id);
// //       setSessionId(data.session_id);
// //       toast({ title: 'JD Uploaded', description: `Session ID: ${data.session_id}` });
// //     } catch (err: any) {
// //       toast({ title: 'Upload Error', description: err.message, variant: 'destructive' });
// //     }
// //   };

// //   // 2️⃣ Generate questions by hitting your back-end
// //   const generateQuestions = async () => {
// //     if (!sessionId) {
// //       return toast({ title: 'No Session', description: 'Upload JD (and resume) first.', variant: 'destructive' });
// //     }
// //     if (!role.trim()) {
// //       return toast({ title: 'No Role', description: 'Enter a target role.', variant: 'destructive' });
// //     }

// //     setIsGenerating(true);
// //     try {
// //       const res = await fetch(`${API_BASE}/generate-questions`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         credentials: 'include',
// //         body: JSON.stringify({ session_id: sessionId, role })
// //       });
// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.error || 'Failed to generate');

// //       // Expect data.questions: Question[]
// //       setQuestions(data.questions);
// //       toast({ title: 'Done', description: `Fetched ${data.questions.length} questions.` });
// //     } catch (err: any) {
// //       toast({ title: 'Error', description: err.message, variant: 'destructive' });
// //     } finally {
// //       setIsGenerating(false);
// //     }
// //   };

// //   // 3️⃣ Submit an answer file for a particular question
// //   const handleAnswerUpload = (qId: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file || !sessionId) return;
// //     const form = new FormData();
// //     form.append('session_id', sessionId);
// //     form.append('question_id', qId);
// //     form.append('answer', file);

// //     try {
// //       const res = await fetch(`${API_BASE}/submit-answer`, {
// //         method: 'POST',
// //         body: form,
// //         credentials: 'include'
// //       });
// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.error || 'Submission failed');

// //       toast({ title: 'Feedback', description: data.feedback });
// //     } catch (err: any) {
// //       toast({ title: 'Upload Error', description: err.message, variant: 'destructive' });
// //     }
// //   };

// //   // Group by category
// //   const grouped = questions.reduce<Record<string, Question[]>>((acc, q) => {
// //     (acc[q.category] ||= []).push(q);
// //     return acc;
// //   }, {});

// //   return (
// //     <>
// //       <Navbar />
// //       <div className="container mx-auto px-4 py-8">
// //         <h1 className="text-3xl font-bold mb-8 text-center">Interview Question Generator</h1>

// //         {/* JD + Role inputs */}
// //         <div className="grid md:grid-cols-2 gap-6 mb-8">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle className="flex items-center">
// //                 <FileText className="mr-2" size={20} />
// //                 Upload Job Description
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <label className="block cursor-pointer border-2 border-dashed rounded-lg p-6 text-center">
// //                 {jdFile ? (
// //                   <div className="text-green-600">
// //                     <FileText size={40} /><br />
// //                     {jdFile.name} ({(jdFile.size/1024).toFixed(1)} KB)
// //                   </div>
// //                 ) : (
// //                   <>
// //                     <Upload size={40} className="text-gray-500" /><br/>
// //                     <span className="text-gray-500">PDF/.doc/.txt</span>
// //                   </>
// //                 )}
// //                 <input type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={handleJdUpload}/>
// //               </label>
// //             </CardContent>
// //           </Card>

// //           <Card>
// //             <CardHeader>
// //               <CardTitle className="flex items-center">
// //                 <Search className="mr-2" size={20} />
// //                 Target Role
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <Input
// //                 placeholder="e.g. Software Engineer"
// //                 value={role}
// //                 onChange={e => setRole(e.target.value)}
// //               />
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Generate Button */}
// //         <div className="text-center mb-10">
// //           <Button
// //             onClick={generateQuestions}
// //             disabled={isGenerating}
// //             className="py-2 px-6"
// //           >
// //             {isGenerating ? 'Generating…' : 'Generate Interview Questions'}
// //           </Button>
// //         </div>

// //         {/* Questions */}
// //         {questions.length > 0 && (
// //           <div className="space-y-8 animate-fade-in">
// //             <h2 className="text-2xl font-semibold text-center mb-4">Generated Questions</h2>
// //             {Object.entries(grouped).map(([cat, qs]) => (
// //               <Card key={cat}>
// //                 <CardHeader>
// //                   <CardTitle className="flex items-center text-lg">
// //                     <MessageSquare className="mr-2" size={18} />
// //                     {cat}
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent>
// //                   {qs.map(q => (
// //                     <div key={q.id} className="mb-4">
// //                       <p className="mb-2">{q.text}</p>
// //                       <label className="block cursor-pointer border border-gray-300 rounded p-2 text-center">
// //                         <Upload size={20} className="inline-block mr-2" />
// //                         Upload Your Answer
// //                         <input
// //                           type="file"
// //                           hidden
// //                           accept=".pdf,.doc,.docx,.txt,wav,mp3"
// //                           onChange={(e) => handleAnswerUpload(q.id)(e)}
// //                         />
// //                       </label>
// //                       <Separator className="my-4" />
// //                     </div>
// //                   ))}
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   );
// // };

// // export default InterviewQuestionsPage;
