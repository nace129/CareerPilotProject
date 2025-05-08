
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        return;
      }
    }
  
    try {
      if (isLogin) {
        // 🔐 Attempt login with Flask backend
        const res = await fetch("http://127.0.0.1:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
  
        const data = await res.json();
  
        if (!res.ok) throw new Error(data.error || "Login failed");
  
        // 💾 Store user info locally
        localStorage.setItem("user", JSON.stringify(data.user));
  
        toast({ title: "Login successful", description: "Welcome!" });
        navigate("/dashboard");
      } else {
        // 🔐 Attempt registration with Flask backend
        const res = await fetch("http://127.0.0.1:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.username,  // Use username as name (or split if needed)
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });
      
        const data = await res.json();
      
        if (!res.ok) throw new Error(data.error || "Registration failed");
      
        // Optionally store user info or redirect
        toast({
          title: "Registration successful",
          description: "Welcome to Career Pilot!",
        });
      
        localStorage.setItem("user", JSON.stringify({
          name: formData.username,
          username: formData.username,
          email: formData.email,
        }));
      
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Interview Assistant</h1>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <Button type="submit" className="w-full font-semibold">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
