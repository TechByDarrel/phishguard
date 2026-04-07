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
  const text = useTypewriter(
    "Detect suspicious links. Stay safe online.",
    35
  );

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <p className="text-sm tracking-[0.3em] text-zinc-500 mb-4">
          PHISHGUARD
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight min-h-[120px]">
          {text}
          <span className="animate-pulse">|</span>
        </h1>

        <p className="text-zinc-400 mb-8 text-lg">
          A cybersecurity-focused tool for checking risky URLs and helping users
          spot phishing attempts.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/check-url">
            <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition">
              Try URL Checker
            </button>
          </Link>

          <Link href="/dashboard">
            <button className="border border-zinc-600 px-6 py-3 rounded-xl hover:bg-zinc-800 transition">
              View Dashboard
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}