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

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; ring: string }> = {
  None: { color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200" },
  Mild: { color: "text-yellow-600", bg: "bg-yellow-50", ring: "ring-yellow-200" },
  Moderate: { color: "text-orange-600", bg: "bg-orange-50", ring: "ring-orange-200" },
  Severe: { color: "text-red-600", bg: "bg-red-50", ring: "ring-red-200" },
};

const SEVERITY_BAR_COLORS: Record<string, string> = {
  none: "bg-emerald-500",
  mild: "bg-yellow-500",
  moderate: "bg-orange-500",
  severe: "bg-red-500",
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
  const progress = (Object.keys(answers).length / 30) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) {
      setError("Please answer all 30 questions before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const requestBody: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      requestBody[`q${i + 1}`] = answers[i];
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const severityStyle = result ? SEVERITY_CONFIG[result.prediction] || SEVERITY_CONFIG.None : null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                Psychiatric Disorder Screening
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Based on DASS-42 · 30 Questions
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Disclaimer Banner */}
        <div className="mb-8 p-5 bg-amber-50/80 border border-amber-200/80 rounded-xl">
          <div className="flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-amber-900 text-sm">Research Disclaimer</h2>
              <p className="text-amber-800/90 text-sm mt-1 leading-relaxed">
                This tool is for <strong>educational and research purposes only</strong>.
                It is not a clinical diagnosis. Please consult a qualified mental health
                professional for any concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && severityStyle && (
          <div className={`mb-8 p-6 rounded-xl ring-1 ${severityStyle.ring} ${severityStyle.bg}`}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Assessment Result
                </p>
                <div className={`text-3xl font-bold ${severityStyle.color}`}>
                  {result.prediction}
                </div>
              </div>
              <button
                onClick={resetForm}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-white/60 transition-colors"
              >
                Retake Assessment →
              </button>
            </div>

            {/* Confidence Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg mb-5">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <span className="text-sm font-medium text-slate-700">
                {(result.confidence * 100).toFixed(1)}% Confidence
              </span>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed mb-6">
              {result.description}
            </p>

            {/* Probability Distribution */}
            <div className="bg-white/50 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Probability Distribution
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(result.probabilities).map(([label, prob]) => {
                  const barColor = SEVERITY_BAR_COLORS[label] || "bg-slate-400";
                  return (
                    <div key={label} className="text-center">
                      <div className="text-xs font-medium text-slate-500 capitalize mb-2">
                        {label}
                      </div>
                      <div className="h-16 bg-slate-100 rounded-md overflow-hidden flex flex-col-reverse">
                        <div
                          className={`${barColor} transition-all duration-500 ease-out`}
                          style={{ height: `${prob * 100}%` }}
                        />
                      </div>
                      <div className="text-sm font-semibold text-slate-700 mt-2">
                        {(prob * 100).toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-5 pt-4 border-t border-slate-200/50">
              {result.disclaimer}
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Questionnaire Form */}
        {!result && (
          <form onSubmit={handleSubmit}>
            {/* Progress Section */}
            <div className="mb-8 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-900">
                  Assessment Progress
                </h2>
                <span className="text-sm font-medium text-slate-500">
                  {Object.keys(answers).length} of 30
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-slate-600 to-slate-800 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-3">
                Indicate how much each statement applied to you <strong>over the past week</strong>.
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {QUESTIONS.map((question, index) => {
                const isAnswered = answers[index] !== undefined;
                return (
                  <div
                    key={index}
                    className={`p-5 rounded-xl border transition-all duration-200 ${isAnswered
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <p className="text-slate-900 mb-4 leading-relaxed">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold mr-3">
                        {index + 1}
                      </span>
                      {question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {RESPONSE_OPTIONS.map((option) => {
                        const isSelected = answers[index] === option.value;
                        return (
                          <label
                            key={option.value}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-150 ${isSelected
                              ? "bg-slate-800 text-white shadow-sm"
                              : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                              }`}
                          >
                            <input
                              type="radio"
                              name={`q${index}`}
                              value={option.value}
                              checked={isSelected}
                              onChange={() => handleAnswerChange(index, option.value)}
                              className="sr-only"
                            />
                            <span
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${isSelected
                                ? "border-white bg-white"
                                : "border-slate-300 bg-white"
                                }`}
                            >
                              {isSelected && (
                                <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                              )}
                            </span>
                            <span className={`text-sm ${isSelected ? "font-medium" : ""}`}>
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Section */}
            <div className="mt-10 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {allAnswered ? "Ready to submit" : `${30 - Object.keys(answers).length} questions remaining`}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your responses are processed securely
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!allAnswered || loading}
                  className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-sm ${allAnswered && !loading
                    ? "bg-slate-900 hover:bg-slate-800 hover:shadow-md"
                    : "bg-slate-300 cursor-not-allowed"
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Get Assessment"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>
              Built with the DASS-42 questionnaire for research purposes
            </p>
            <p className="text-slate-400">
              Not a substitute for professional diagnosis
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
