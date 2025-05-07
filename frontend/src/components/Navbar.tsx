
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  // Check which path is active
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="font-bold text-xl text-indigo-600">
            InterviewAI
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
              Dashboard
            </NavLink>
            <NavLink to="/resume-analysis" isActive={isActive('/resume-analysis')}>
              Resume Analysis
            </NavLink>
            <NavLink to="/interview-questions" isActive={isActive('/interview-questions')}>
              Interview Questions
            </NavLink>
            <NavLink to="/profile" isActive={isActive('/profile')}>
              Profile
            </NavLink>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex">
            <div className="flex space-x-2">
              <MobileNavLink to="/dashboard" isActive={isActive('/dashboard')}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink to="/resume-analysis" isActive={isActive('/resume-analysis')}>
                Resume
              </MobileNavLink>
              <MobileNavLink to="/interview-questions" isActive={isActive('/interview-questions')}>
                Questions
              </MobileNavLink>
              <MobileNavLink to="/profile" isActive={isActive('/profile')}>
                Profile
              </MobileNavLink>
            </div>
          </div>
          
          {/* User Menu - Just a placeholder for now */}
          <div className="flex items-center">
            <Link to="/profile">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                J
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`inline-block px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
        isActive
          ? 'border-indigo-600 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, isActive, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`block px-3 py-1 text-xs rounded-full font-medium ${
        isActive
          ? 'bg-indigo-100 text-indigo-800'
          : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
