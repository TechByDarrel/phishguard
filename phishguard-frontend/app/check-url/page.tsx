"use client";

import { useState } from "react";
import axios from "axios";

type ScanData = {
  id: number;
  url: string;
  risk_score: number;
  level: string;
  findings: string;
  created_at: string;
};

type CheckResult = {
  success: boolean;
  message?: string;
  data?: ScanData;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  const saveScanLocally = (scan: ScanData) => {
    const existingScans = JSON.parse(
      localStorage.getItem("phishguard_scans") || "[]"
    );

    const updatedScans = [scan, ...existingScans].slice(0, 50);

    localStorage.setItem("phishguard_scans", JSON.stringify(updatedScans));
  };

  const handleCheckUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/check-url`, {
        url,
      });

      setResult(response.data);

      if (response.data?.data) {
        saveScanLocally(response.data.data);
      }
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
    <main className="min-h-screen bg-black text-white px-5 py-10 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <p className="mb-3 text-xs tracking-[0.35em] text-zinc-500 sm:text-sm">
            PHISHGUARD
          </p>

          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            Check a Suspicious URL
          </h1>

          <p className="text-sm text-zinc-400 sm:text-base md:text-lg">
            Paste a link below to analyze phishing risk and detect possible red flags.
          </p>
        </div>

        <form
          onSubmit={handleCheckUrl}
          className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg sm:p-6"
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
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Analyzing..." : "Check URL"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-800 bg-red-950/40 p-4">
            <p className="font-medium text-red-300">Error</p>
            <p className="mt-1 text-sm text-red-200">{error}</p>
          </div>
        )}

        {result?.data && (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Analysis Result</h2>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${getLevelColor(
                  result.data.level
                )}`}
              >
                {result.data.level} Risk
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm text-zinc-500">URL</p>
                <p className="break-all text-white">{result.data.url}</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-zinc-500">Risk Score</p>
                <p className="font-semibold text-white">
                  {result.data.risk_score}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm text-zinc-500">Findings</p>
                <ul className="list-disc space-y-1 pl-6 text-zinc-300">
                  {result.data.findings.split(", ").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-1 text-sm text-zinc-500">Checked At</p>
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