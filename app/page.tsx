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

export default function Home() {
  const [text, setText] = useState<string>("");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function loadSignals() {
    const res = await fetch("/api/signals");
    const data: Signal[] = await res.json();
    setSignals(data);
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSignals();
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 700 }}>
      <h2>OpsSense</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter any operational input..."
        style={{ width: "100%", height: 80 }}
      />

      <br />

      <button onClick={submitSignal} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <h3>Signals</h3>

      {signals.length === 0 && <p>No signals yet.</p>}

      {signals.map((s) => (
        <div key={s.id} style={{ marginBottom: 12 }}>
          <b>{s.derived?.category || "Unknown"}</b>{" "}
          ({s.derived?.severity || "Low"})
          <br />
          {s.raw_text}
        </div>
      ))}
    </main>
  );
}
