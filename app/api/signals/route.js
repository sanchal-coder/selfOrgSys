import { supabase } from "@/lib/supabase";

function deriveSignal(text) {
  const t = text.toLowerCase();

  
  if (
    t.includes("overheat") ||
    t.includes("overheating") ||
    t.includes("voltage drop") ||
    t.includes("shutdown") ||
    t.includes("critical")
  ) {
    return { category: "Incident", severity: "High" };
  }

  
  if (
    t.includes("failed qa") ||
    t.includes("failed") ||
    t.includes("defect") ||
    t.includes("error")
  ) {
    return { category: "Issue", severity: "Medium" };
  }

  
  if (
    t.includes("needs") ||
    t.includes("investigate") ||
    t.includes("fix") ||
    t.includes("replace") ||
    t.includes("check")
  ) {
    return { category: "Task", severity: "Medium" };
  }

  
  if (
    t.includes("delay") ||
    t.includes("shipment") ||
    t.includes("vendor") ||
    t.includes("delivery")
  ) {
    return { category: "Event", severity: "Low" };
  }

  
  if (
    t.includes("observed") ||
    t.includes("recorded") ||
    t.includes("noted")
  ) {
    return { category: "Log", severity: "Low" };
  }

  
  return { category: "Note", severity: "Low" };
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

