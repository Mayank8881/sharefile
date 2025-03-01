"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDocAPI } from "@/app/endpoints/docs";

const FilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const doc = await getDocAPI(id);
        setData(doc);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.file_url);
      alert("File path copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const sendEmail = async () => {
    if (!recipientEmail) {
      setMessage("❌ Please enter a recipient email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail, fileUrl: data.file_url }),
      });

      const result = await response.json();
      console.log("Email API Response:", result);

      if (response.ok) {
        setMessage("✅ Email sent successfully!");
      } else {
        setMessage(`❌ Error: ${result.error || "Failed to send email."}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto mt-20 border p-4 flex flex-col items-center gap-4">
      <h4 className="font-bold text-xl ">{data.title}</h4>

      {/* Download Button */}
      <a href={data.file_url} className="bg-slate-800 text-white rounded-md py-2 px-4 w-full text-center">
        Download File
      </a>

      {/* Copy Path Button */}
      <button 
        onClick={handleCopy}
        className="bg-slate-800 text-white rounded-md py-2 px-4 w-full text-center"
      >
        Copy Path
      </button>

      {/* Email Input Field */}
      <input
        type="email"
        placeholder="Enter email to share"
        className="border p-2 w-full bg-gray-200 text-slate-800 text-center"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
      />

      {/* Share via Email Button */}
      <button
        onClick={sendEmail}
        disabled={loading}
        className={`bg-blue-600 text-white rounded-md py-2 px-4 w-full text-center ${loading ? "opacity-50" : ""}`}
      >
        {loading ? "Sending..." : "Share via Email"}
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </div>
  );
};

export default FilePage;
