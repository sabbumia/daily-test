// app/test/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface WordTest {
  word: string;
  meaning: string;
  options: string[];
  correctAnswer: string;
}

interface TestData {
  test: {
    id: number;
    date: string;
    words: WordTest[];
  };
  alreadyCompleted: boolean;
  previousScore?: number;
}

interface TestResult {
  word: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [savedWordIds, setSavedWordIds] = useState<Set<string>>(new Set());
  const [savingWord, setSavingWord] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    fetchTest(token);
  }, [testId, router]);

  const fetchTest = async (token: string) => {
    try {
      const response = await fetch(`/api/tests/${testId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/signin');
        return;
      }

      if (response.status === 403) {
        const data = await response.json();
        setError(data.error);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTestData(data);
      setAnswers(new Array(data.test.words.length).fill(''));
    } catch (error) {
      console.error('Error fetching test:', error);
      setError('Failed to load test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleSaveWord = async (word: WordTest) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSavingWord(word.word);

    try {
      const response = await fetch('/api/saved-words', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word.word,
          meaning: word.correctAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSavedWordIds(prev => new Set(prev).add(word.word));
        alert('Word saved successfully!');
      } else {
        alert(data.error || 'Failed to save word');
      }
    } catch (error) {
      console.error('Error saving word:', error);
      alert('Failed to save word');
    } finally {
      setSavingWord(null);
    }
  };

  const handleNext = () => {
    if (currentQuestion < (testData?.test.words.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some(a => !a)) {
      alert('Please answer all questions before submitting');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4">Test Completed!</h1>
              <div className="text-6xl font-bold mb-2">{results.percentage.toFixed(1)}%</div>
              <p className="text-xl text-indigo-100">
                Score: {results.score} / {results.totalQuestions}
              </p>
            </div>

            {/* Detailed Results */}
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Answers</h2>
              <div className="space-y-4">
                {results.results.map((result: TestResult, index: number) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border-2 ${
                      result.isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {index + 1}. {result.word}
                      </h3>
                      {result.isCorrect ? (
                        <span className="flex items-center text-green-600 font-semibold">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Correct
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 font-semibold">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Incorrect
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {!result.isCorrect && (
                        <p className="text-gray-700">
                          <span className="font-medium">Your answer:</span> {result.userAnswer}
                        </p>
                      )}
                      <p className="text-gray-700">
                        <span className="font-medium">Correct answer:</span> {result.correctAnswer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!testData) return null;

  const currentWord = testData.test.words[currentQuestion];
  const progress = ((currentQuestion + 1) / testData.test.words.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Vocabulary Test</h1>
              <span className="text-indigo-100">
                Question {currentQuestion + 1} of {testData.test.words.length}
              </span>
            </div>
            <div className="w-full bg-indigo-400 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">{currentWord.word}</h2>
                <button
                  onClick={() => handleSaveWord(currentWord)}
                  disabled={savingWord === currentWord.word || savedWordIds.has(currentWord.word)}
                  className={`flex items-center px-4 py-2 rounded-lg font-semibold transition ${
                    savedWordIds.has(currentWord.word)
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {savingWord === currentWord.word ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : savedWordIds.has(currentWord.word) ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Saved
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Save Word
                    </>
                  )}
                </button>
              </div>
              <p className="text-gray-600">Select the correct meaning:</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentWord.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    answers[currentQuestion] === option
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        answers[currentQuestion] === option
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {answers[currentQuestion] === option && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentQuestion === testData.test.words.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion]}
                  className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}