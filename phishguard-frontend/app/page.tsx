export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-4">
          PhishGuard
        </p>

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Detect suspicious links.
          <br />
          Stay safe online.
        </h1>

        <p className="text-lg text-zinc-300 mb-8">
          A cybersecurity-focused tool for checking risky URLs and helping users spot phishing attempts.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="/check-url"
            className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Try URL Checker
          </a>

          <a
            href="/dashboard"
            className="inline-block border border-zinc-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-zinc-900 transition"
          >
            View Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}