import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); // Service role key for secure read

export async function POST(req) {
  const { id, password } = await req.json();
  const { data, error } = await supabase
    .from("doc")
    .select("password")
    .eq("id", id)
    .single();

  if (error) return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });

  const isCorrect = await bcrypt.compare(password, data.password);
  if (!isCorrect) {
    return new Response(JSON.stringify({ error: "Incorrect password" }), { status: 401 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
