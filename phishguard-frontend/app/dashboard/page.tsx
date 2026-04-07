"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type UrlCheck = {
  id: number;
  url: string;
  risk_score: number;
  level: string;
  findings: string;
  created_at: string;
};

type DashboardResponse = {
  success: boolean;
  count: number;
  data: UrlCheck[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DashboardPage() {
  const [checks, setChecks] = useState<UrlCheck[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchChecks = async () => {
      try {
        const response = await axios.get<DashboardResponse>(
          `${API_BASE_URL}/api/url-checks`
        );
        setChecks(response.data.data);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChecks();
  }, []);

  const totalChecks = checks.length;
  const highRiskCount = checks.filter(
    (check) => check.level === "High" || check.level === "Very High"
  ).length;
  const mediumRiskCount = checks.filter((check) => check.level === "Medium").length;
  const lowRiskCount = checks.filter((check) => check.level === "Low").length;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-3">
            PhishGuard
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
          <p className="text-zinc-400 text-base md:text-lg">
            View saved URL scans and monitor phishing risk activity.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-zinc-300">Loading dashboard...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-800 bg-red-950/30 p-6 mb-8">
            <p className="text-red-300 font-semibold mb-1">Error</p>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-zinc-500 text-sm mb-2">Total Checks</p>
                <h2 className="text-3xl font-bold">{totalChecks}</h2>
              </div>

              <div className="rounded-2xl border border-red-800 bg-red-950/20 p-5">
                <p className="text-red-300 text-sm mb-2">High / Very High</p>
                <h2 className="text-3xl font-bold text-red-400">{highRiskCount}</h2>
              </div>

              <div className="rounded-2xl border border-yellow-800 bg-yellow-950/20 p-5">
                <p className="text-yellow-300 text-sm mb-2">Medium Risk</p>
                <h2 className="text-3xl font-bold text-yellow-400">{mediumRiskCount}</h2>
              </div>

              <div className="rounded-2xl border border-green-800 bg-green-950/20 p-5">
                <p className="text-green-300 text-sm mb-2">Low Risk</p>
                <h2 className="text-3xl font-bold text-green-400">{lowRiskCount}</h2>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
              <div className="p-5 border-b border-zinc-800">
                <h2 className="text-2xl font-semibold">Recent URL Checks</h2>
              </div>

              {checks.length === 0 ? (
                <div className="p-6">
                  <p className="text-zinc-400">No URL checks found yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {checks.map((check) => (
                    <div key={check.id} className="p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                        <div className="flex-1 min-w-[240px]">
                          <p className="text-sm text-zinc-500 mb-1">URL</p>
                          <p className="text-white break-all">{check.url}</p>
                        </div>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${getLevelColor(
                            check.level
                          )}`}
                        >
                          {check.level}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-zinc-500 mb-1">Risk Score</p>
                          <p className="text-white font-semibold">{check.risk_score}</p>
                        </div>

                        <div className="md:col-span-2">
                          <p className="text-sm text-zinc-500 mb-1">Findings</p>
                          <p className="text-zinc-300">{check.findings}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-zinc-500 mb-1">Checked At</p>
                        <p className="text-zinc-400">
                          {new Date(check.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}