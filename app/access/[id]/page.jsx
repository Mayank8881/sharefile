"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function FileAccess({ params }) {
  const { id } = params;
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAccess = async () => {
    const { data, error } = await supabase
      .from("doc")
      .select("file_url, password")
      .eq("id", id)
      .single();

    if (error || !data) {
      setError("File not found.");
      return;
    }

    if (data.password === passwordInput) {
      window.location.href = data.file_url;
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">Enter Password to Access File</h2>
        <input
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="border rounded px-4 py-2 w-full mb-4"
        />
        <button
          onClick={handleAccess}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Unlock File
        </button>
        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}


  