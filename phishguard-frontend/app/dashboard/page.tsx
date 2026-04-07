"use client";

import { useEffect, useMemo, useState } from "react";
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

function useTypewriter(text: string, speed = 45) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
}

export default function DashboardPage() {
  const [checks, setChecks] = useState<UrlCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const animatedHeading = useTypewriter("Monitor phishing activity in real time.");

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
        setChecks(response.data.data || []);
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

  const stats = useMemo(() => {
    const totalChecks = checks.length;
    const highRiskCount = checks.filter(
      (check) => check.level === "High" || check.level === "Very High"
    ).length;
    const mediumRiskCount = checks.filter(
      (check) => check.level === "Medium"
    ).length;
    const lowRiskCount = checks.filter((check) => check.level === "Low").length;

    return {
      totalChecks,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
    };
  }, [checks]);

  return (
    <main className="min-h-screen bg-black px-5 py-10 text-white sm:px-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-xs tracking-[0.35em] text-zinc-500 sm:text-sm">
            PHISHGUARD
          </p>

          <h1 data-text="Dashboard" className="glitch mb-4 text-4xl font-bold sm:text-5xl">
            Dashboard
          </h1>

          <p className="min-h-[32px] text-sm text-zinc-400 sm:text-base md:text-lg">
            {animatedHeading}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-zinc-300">Loading dashboard...</p>
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-800 bg-red-950/30 p-6">
            <p className="mb-1 font-semibold text-red-300">Error</p>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="mb-2 text-sm text-zinc-500">Total Checks</p>
                <h2 className="text-3xl font-bold">{stats.totalChecks}</h2>
              </div>

              <div className="rounded-2xl border border-red-800 bg-red-950/20 p-5">
                <p className="mb-2 text-sm text-red-300">High / Very High</p>
                <h2 className="text-3xl font-bold text-red-400">
                  {stats.highRiskCount}
                </h2>
              </div>

              <div className="rounded-2xl border border-yellow-800 bg-yellow-950/20 p-5">
                <p className="mb-2 text-sm text-yellow-300">Medium Risk</p>
                <h2 className="text-3xl font-bold text-yellow-400">
                  {stats.mediumRiskCount}
                </h2>
              </div>

              <div className="rounded-2xl border border-green-800 bg-green-950/20 p-5">
                <p className="mb-2 text-sm text-green-300">Low Risk</p>
                <h2 className="text-3xl font-bold text-green-400">
                  {stats.lowRiskCount}
                </h2>
              </div>
            </div>

            {checks.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  No scans yet
                </h2>
                <p className="mx-auto max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                  The dashboard is empty because no suspicious URL has been checked
                  and saved yet. Once you scan a URL from the checker page, it will
                  appear here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                <div className="border-b border-zinc-800 p-5">
                  <h2 className="text-2xl font-semibold">Recent URL Checks</h2>
                </div>

                <div className="divide-y divide-zinc-800">
                  {checks.map((check) => (
                    <div key={check.id} className="p-5">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-[240px] flex-1">
                          <p className="mb-1 text-sm text-zinc-500">URL</p>
                          <p className="break-all text-white">{check.url}</p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${getLevelColor(
                            check.level
                          )}`}
                        >
                          {check.level}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <p className="mb-1 text-sm text-zinc-500">Risk Score</p>
                          <p className="font-semibold text-white">
                            {check.risk_score}
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <p className="mb-1 text-sm text-zinc-500">Findings</p>
                          <p className="text-zinc-300">{check.findings}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-1 text-sm text-zinc-500">Checked At</p>
                        <p className="text-zinc-400">
                          {new Date(check.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}