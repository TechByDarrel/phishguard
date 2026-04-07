"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function useTypewriter(text: string, speed = 40) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
}

export default function HomePage() {
  const text = useTypewriter("Detect suspicious links. Stay safe online.", 35);

  return (
    <main className="min-h-screen bg-black text-white px-5 py-10 sm:px-6 md:px-8">
      <div className="mx-auto flex min-h-[85vh] max-w-5xl items-center justify-center">
        <div className="w-full text-center">
          <p className="mb-4 text-xs tracking-[0.35em] text-zinc-500 sm:text-sm">
            PHISHGUARD
          </p>

          <h1
  data-text={text}
  className="glitch mb-6 min-h-[110px] text-4xl font-bold leading-tight sm:min-h-[140px] sm:text-5xl md:min-h-[160px] md:text-6xl"
>
            {text}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base md:text-lg">
            A cybersecurity-focused tool for checking risky URLs and helping
            users spot phishing attempts before they click.
          </p>

          <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/check-url" className="w-full sm:w-auto">
              <button className="w-full rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200">
                Try URL Checker
              </button>
            </Link>

            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full rounded-xl border border-zinc-600 px-6 py-3 transition hover:bg-zinc-900">
                View Dashboard
              </button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
              <p className="text-sm font-semibold text-white">Fast URL Scans</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Check suspicious links instantly and see phishing signals clearly.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
              <p className="text-sm font-semibold text-white">Risk Scoring</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Get low, medium, high, and very high risk feedback in seconds.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
              <p className="text-sm font-semibold text-white">Dashboard Logs</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Track saved scans and monitor patterns over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}