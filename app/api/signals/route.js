import { supabase } from "@/lib/supabase";

function deriveSignal(text) {
  const t = text.toLowerCase();

  if (t.includes("overheat") || t.includes("overheating")) {
    return { category: "Maintenance", severity: "High" };
  }

  if (t.includes("delay") || t.includes("shipment")) {
    return { category: "Logistics", severity: "Medium" };
  }

  if (t.includes("failed") || t.includes("error")) {
    return { category: "Quality", severity: "High" };
  }

  return { category: "Unknown", severity: "Low" };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const text = body?.text?.trim();

    if (!text) {
      return Response.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    const derived = deriveSignal(text);

    const { error } = await supabase.from("signals").insert({
      raw_text: text,
      source: body.source || "unknown",
      derived
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: "Failed to fetch signals" },
      { status: 500 }
    );
  }
}

