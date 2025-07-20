import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET: fetch comments for a file (file_id in query)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const file_id = searchParams.get("file_id");
  const user_id = searchParams.get("user_id");
  const user_email = searchParams.get("user_email");
  if (!file_id || (!user_id && !user_email)) {
    return new Response(JSON.stringify({ error: "Missing file_id or user_id/user_email" }), { status: 400 });
  }

  // Check if user is allowed (uploader or recipient)
  const { data: file, error: fileError } = await supabase
    .from("doc")
    .select("uid, recipient_email")
    .eq("id", file_id)
    .single();
  if (fileError || !file) {
    return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
  }

  if (file.uid !== user_id && file.recipient_email !== user_email) {
    return new Response(JSON.stringify({ error: "Not authorized" }), { status: 403 });
  }

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*, user_id, user_email")
    .eq("file_id", file_id)
    .order("created_at", { ascending: true });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(comments), { status: 200 });
}

// POST: add a comment (expects { file_id, user_id/user_email, content })
export async function POST(req) {
  const { file_id, user_id, user_email, content } = await req.json();
  if (!file_id || (!user_id && !user_email) || !content) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  // Check if user is allowed (uploader or recipient)
  const { data: file, error: fileError } = await supabase
    .from("doc")
    .select("uid, recipient_email")
    .eq("id", file_id)
    .single();
  if (fileError || !file) {
    return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
  }
  if (file.uid !== user_id && file.recipient_email !== user_email) {
    return new Response(JSON.stringify({ error: "Not authorized" }), { status: 403 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert([{ file_id, user_id, user_email, content }])
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 201 });
} 