import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("signals")
      .select("derived");

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const summary = {};

    data.forEach((row) => {
      const category = row.derived?.category || "Unknown";
      summary[category] = (summary[category] || 0) + 1;
    });

    return Response.json(summary);
  } catch (err) {
    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  } 
}
