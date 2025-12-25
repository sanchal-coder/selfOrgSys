"use client";

import { useEffect, useState } from "react";

type Signal = {
  id: string;
  raw_text: string;
  source: string;
  derived: {
    category?: string;
    severity?: string;
  };
  created_at: string;
};

type Summary = {
  [category: string]: number;
};

export default function Home() {
  const [text, setText] = useState("");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadSignals() {
    const res = await fetch("/api/signals");
    setSignals(await res.json());
  }

  async function loadSummary() {
    const res = await fetch("/api/analytics/summary");
    setSummary(await res.json());
  }

  async function submitSignal() {
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source: "human" })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit");
      }

      setText("");
      loadSignals();
      loadSummary();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSignals();
    loadSummary();
  }, []);

  return (
    <main
      style={{
        padding: 32,
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: 8 }}>SelfMetrics</h1>
        <p style={{ color: "#555" }}>
          Turn unstructured operational inputs into actionable signals.
        </p>
      </header>

      {/* Input Card */}
      <section
        style={{
          padding: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          marginBottom: 32
        }}
      >
        <h3 style={{ marginBottom: 8 }}>New Signal</h3>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Motor overheating after 3 hours"
          style={{
            width: "100%",
            height: 80,
            padding: 8,
            marginBottom: 12
          }}
        />

        <button
          onClick={submitSignal}
          disabled={loading}
          style={{
            padding: "8px 16px",
            cursor: "pointer"
          }}
        >
          {loading ? "Submitting..." : "Submit Signal"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 8 }}>{error}</p>
        )}
      </section>

      {/* Analytics */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Signals by Category</h3>

        {Object.keys(summary).length === 0 && (
          <p style={{ color: "#777" }}>No analytics yet.</p>
        )}

        {Object.entries(summary).map(([category, count]) => (
          <div key={category} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 14, marginBottom: 4 }}>
              {category} ({count})
            </div>
            <div
              style={{
                height: 10,
                width: `${count * 50}px`,
                background: "#2563eb",
                borderRadius: 4
              }}
            />
          </div>
        ))}
      </section>

      {/* Signals Feed */}
      <section>
        <h3 style={{ marginBottom: 12 }}>Recent Signals</h3>

        {signals.length === 0 && (
          <p style={{ color: "#777" }}>No signals yet.</p>
        )}

        {signals.map((s) => (
          <div
            key={s.id}
            style={{
              padding: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              marginBottom: 12
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {s.derived?.category || "Unknown"} ·{" "}
              {s.derived?.severity || "Low"}
            </div>

            <div style={{ color: "#555", marginTop: 4 }}>
              {s.raw_text}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
