"use client";

import { useState } from "react";
import axios from "axios";

type CheckResult = {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    url: string;
    risk_score: number;
    level: string;
    findings: string;
    created_at: string;
  };
};

export default function CheckUrlPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLevelColor = (level: string) => {
    if (level === "Very High" || level === "High") {
      return "text-red-400 border-red-400 bg-red-950/30";
    }
    if (level === "Medium") {
      return "text-yellow-400 border-yellow-400 bg-yellow-950/30";
    }
    return "text-green-400 border-green-400 bg-green-950/30";
  };

  const handleCheckUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/api/check-url",
        { url }
      );

      setResult(response.data);
    } catch (err: any) {
      console.error("Frontend error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-3">
            PhishGuard
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Check a Suspicious URL
          </h1>
          <p className="text-zinc-400 text-base md:text-lg">
            Paste a link below to analyze phishing risk and detect possible red flags.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleCheckUrl}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4"
        >
          <label
            htmlFor="url"
            className="block text-sm font-medium text-zinc-300"
          >
            Suspicious URL
          </label>

          <input
            id="url"
            type="text"
            placeholder="Enter a suspicious URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-zinc-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Check URL"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl bg-red-950/40 border border-red-800 p-4">
            <p className="text-red-300 font-medium">Error</p>
            <p className="text-red-200 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Result */}
        {result?.data && (
          <div className="mt-8 rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <h2 className="text-2xl font-semibold">Analysis Result</h2>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${getLevelColor(
                  result.data.level
                )}`}
              >
                {result.data.level} Risk
              </span>
            </div>

            <div className="space-y-4">
              {/* URL */}
              <div>
                <p className="text-sm text-zinc-500 mb-1">URL</p>
                <p className="break-all text-white">{result.data.url}</p>
              </div>

              {/* Risk Score */}
              <div>
                <p className="text-sm text-zinc-500 mb-1">Risk Score</p>
                <p className="text-white font-semibold">
                  {result.data.risk_score}
                </p>
              </div>

              {/* Findings (bullet points) */}
              <div>
                <p className="text-sm text-zinc-500 mb-1">Findings</p>
                <ul className="list-disc pl-6 space-y-1 text-zinc-300">
                  {result.data.findings
                    .split(", ")
                    .map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>

              {/* Time */}
              <div>
                <p className="text-sm text-zinc-500 mb-1">Checked At</p>
                <p className="text-zinc-400">
                  {new Date(result.data.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}