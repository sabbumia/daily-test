// app/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20 -bottom-48 left-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all duration-300 group-hover:scale-110 transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
            </div>
            <span className="text-white font-bold text-2xl bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Daily Test
            </span>
          </div>
          <Link
            href="/signin"
            className="text-gray-300 hover:text-white transition font-medium px-6 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 min-h-[calc(100vh-88px)] flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-5 py-2.5 rounded-full text-sm font-semibold border border-purple-500/30 backdrop-blur-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 transform">
                ✨ AI-Powered Learning Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight animate-fade-in-up">
              Master English
              <span className="block bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Vocabulary
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Take daily AI-generated vocabulary tests, track your progress, and achieve fluency with personalized learning
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/signup"
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl shadow-purple-600/50 hover:shadow-purple-600/70 hover:scale-105 transform"
              >
                Get Started Free
              </Link>
              <Link
                href="/signin"
                className="px-10 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 transform"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-8 text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
              No credit card required • Start learning in seconds
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 mb-24 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-purple-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">AI-Powered Tests</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Daily vocabulary tests intelligently generated by Google Gemini AI, tailored to your learning level
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-indigo-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/50 group-hover:shadow-indigo-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors duration-300">Track Progress</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Monitor your scores and improvement over time with detailed analytics and insights
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-pink-900/40 to-pink-800/20 backdrop-blur-xl rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-pink-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-pink-500 to-pink-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50 group-hover:shadow-pink-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-pink-300 transition-colors duration-300">Daily Challenge</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  New test every day at midnight to keep you learning consistently and building habits
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-cyan-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-300">Save & Customize</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Save your favorite words and create custom vocabulary lists to study anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}