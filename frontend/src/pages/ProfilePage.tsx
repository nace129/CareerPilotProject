
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from '@/components/Navbar';

const ProfilePage = () => {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff",
    stats: {
      interviewsTaken: 12,
      averageMatchScore: 78,
      questionsAnswered: 84,
      completionRate: 92
    },
    recentUploads: [
      { type: "resume", name: "Software_Developer_Resume.pdf", date: "2025-04-25" },
      { type: "job", name: "Frontend_Developer_JD.docx", date: "2025-04-25" },
      { type: "resume", name: "Full_Stack_Resume.pdf", date: "2025-04-20" },
      { type: "job", name: "React_Developer_JD.pdf", date: "2025-04-20" }
    ]
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* User Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary flex-shrink-0">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Free Account
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Interviews Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user.stats.interviewsTaken}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Average Match Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user.stats.averageMatchScore}%</div>
                <Progress value={user.stats.averageMatchScore} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Questions Answered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user.stats.questionsAnswered}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user.stats.completionRate}%</div>
                <Progress value={user.stats.completionRate} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="pb-3">File Type</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Upload Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.recentUploads.map((file, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3">
                          <span 
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              file.type === 'resume' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {file.type === 'resume' ? 'Resume' : 'Job Description'}
                          </span>
                        </td>
                        <td className="py-3">{file.name}</td>
                        <td className="py-3 text-gray-500">{file.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
