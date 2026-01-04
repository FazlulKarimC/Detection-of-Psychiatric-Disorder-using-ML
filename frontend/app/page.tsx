"use client";

import { useState } from "react";

// Questions from DASS-42 questionnaire (30 selected by RFE)
const QUESTIONS = [
  "I found myself getting upset by quite trivial things.",
  "I couldn't seem to experience any positive feeling at all.",
  "I experienced breathing difficulty (e.g., breathlessness without physical exertion).",
  "I just couldn't seem to get going.",
  "I had a feeling of shakiness (e.g., legs going weak).",
  "I found it difficult to relax.",
  "I found myself in situations that made me so anxious I was relieved when they ended.",
  "I felt that I had nothing to look forward to.",
  "I found myself getting upset rather easily.",
  "I felt that I was using a lot of nervous energy.",
  "I felt sad and depressed.",
  "I felt that I had lost interest in just about everything.",
  "I felt I wasn't worth much as a person.",
  "I felt scared without any good reason.",
  "I felt that life wasn't worthwhile.",
  "I found it hard to wind down.",
  "I couldn't seem to get any enjoyment out of the things I did.",
  "I felt down-hearted and blue.",
  "I found that I was very irritable.",
  "I felt I was close to panic.",
  "I found it hard to calm down after something upset me.",
  "I feared that I would be 'thrown' by some trivial but unfamiliar task.",
  "I found it difficult to tolerate interruptions to what I was doing.",
  "I was in a state of nervous tension.",
  "I felt I was pretty worthless.",
  "I felt terrified.",
  "I felt that life was meaningless.",
  "I found myself getting agitated.",
  "I was worried about situations in which I might panic and make a fool of myself.",
  "I experienced trembling (e.g., in the hands).",
];

const RESPONSE_OPTIONS = [
  { value: 1, label: "Did not apply to me at all" },
  { value: 2, label: "Applied to me to some degree" },
  { value: 3, label: "Applied to me considerably" },
  { value: 4, label: "Applied to me very much" },
];

const SEVERITY_COLORS: Record<string, string> = {
  None: "#22c55e",
  Mild: "#eab308",
  Moderate: "#f97316",
  Severe: "#ef4444",
};

interface PredictionResult {
  prediction: string;
  severity_level: number;
  confidence: number;
  probabilities: Record<string, number>;
  description: string;
  disclaimer: string;
}

export default function Home() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const allAnswered = Object.keys(answers).length === 30;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) {
      setError("Please answer all 30 questions before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Build request body
    const requestBody: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      requestBody[`q${i + 1}`] = answers[i];
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError("Request timed out. Please check if the server is running and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to get prediction");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAnswers({});
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Psychiatric Disorder Screening Tool
          </h1>
          <p className="mt-1 text-gray-600">
            Based on the DASS-42 (Depression Anxiety Stress Scales)
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Disclaimer Banner */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex">
            <span className="text-amber-600 text-xl mr-3">⚠️</span>
            <div>
              <h2 className="font-semibold text-amber-800">Important Disclaimer</h2>
              <p className="text-amber-700 text-sm mt-1">
                This tool is for <strong>educational and informational purposes only</strong>.
                It is NOT a medical diagnosis. If you are experiencing mental health concerns,
                please consult a qualified mental health professional.
              </p>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div
            className="mb-8 p-6 rounded-lg border-2"
            style={{
              borderColor: SEVERITY_COLORS[result.prediction],
              backgroundColor: `${SEVERITY_COLORS[result.prediction]}10`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Result</h2>
              <button
                onClick={resetForm}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Take Again
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div
                className="text-4xl font-bold"
                style={{ color: SEVERITY_COLORS[result.prediction] }}
              >
                {result.prediction}
              </div>
              <div className="text-gray-600">
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <p className="text-gray-700 mb-4">{result.description}</p>

            {/* Probability Distribution */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-sm text-gray-600">
                Probability Distribution
              </h3>
              <div className="flex gap-2">
                {Object.entries(result.probabilities).map(([label, prob]) => (
                  <div key={label} className="flex-1">
                    <div className="text-xs text-gray-500 capitalize mb-1">{label}</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${prob * 100}%`,
                          backgroundColor: SEVERITY_COLORS[label.charAt(0).toUpperCase() + label.slice(1)] || '#6b7280'
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(prob * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">{result.disclaimer}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Questionnaire Form */}
        {!result && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Questionnaire
                </h2>
                <span className="text-sm text-gray-500">
                  {Object.keys(answers).length} / 30 answered
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Please indicate how much each statement applied to you over the past week.
              </p>
            </div>

            <div className="space-y-6">
              {QUESTIONS.map((question, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${answers[index] ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                >
                  <p className="font-medium text-gray-900 mb-3">
                    <span className="text-gray-500 mr-2">{index + 1}.</span>
                    {question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {RESPONSE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center p-2 rounded cursor-pointer transition-colors
                          ${answers[index] === option.value
                            ? 'bg-blue-100 border-blue-500 border-2'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                          }`}
                      >
                        <input
                          type="radio"
                          name={`q${index}`}
                          value={option.value}
                          checked={answers[index] === option.value}
                          onChange={() => handleAnswerChange(index, option.value)}
                          className="sr-only"
                        />
                        <span className={`text-sm ${answers[index] === option.value ? 'font-medium text-blue-900' : 'text-gray-700'
                          }`}>
                          {option.value}. {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex flex-col items-center">
              <button
                type="submit"
                disabled={!allAnswered || loading}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-colors
                  ${allAnswered && !loading
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Get Assessment'
                )}
              </button>
              {!allAnswered && (
                <p className="mt-2 text-sm text-gray-500">
                  Please answer all 30 questions to continue
                </p>
              )}
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>
            This tool uses the DASS-42 questionnaire. Data processing is done locally on the server.
          </p>
          <p className="mt-2">
            Built for educational purposes • Not a substitute for professional help
          </p>
        </div>
      </footer>
    </div>
  );
}
