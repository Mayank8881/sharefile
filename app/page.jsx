"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UploadCloud, Share2, Download } from "lucide-react";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className={`bg-white shadow-md w-full top-0 z-50 transition-all duration-300 ${isScrolled ? "fixed" : "relative"}`}>
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-slate-800">FileShare</h1>
          <Link href="/home">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-grow flex items-center justify-center text-center px-6 bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Secure & Easy File Sharing</h2>
          <p className="text-gray-200 mt-4 text-lg">Upload and share your files securely with anyone, anywhere.</p>
          <Link href="/login">
            <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-md text-lg hover:bg-gray-200 transition">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white text-center">
        <h3 className="text-3xl font-semibold text-gray-800">How It Works</h3>
        <div className="mt-6 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Upload", desc: "Select your files and upload securely.", icon: <UploadCloud size={40} /> },
            { title: "Share", desc: "Generate a secure link to share.", icon: <Share2 size={40} /> },
            { title: "Access", desc: "Recipients can download anytime.", icon: <Download size={40} /> },
          ].map((step, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-md hover:bg-blue-100 transition duration-300">
              <div className="flex justify-center text-blue-600">{step.icon}</div>
              <h4 className="text-xl font-bold mt-3">{step.title}</h4>
              <p className="text-gray-600 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-100 text-center px-6">
        <h3 className="text-3xl font-semibold text-gray-800">Features</h3>
        <div className="mt-6 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "End-to-End Encryption", desc: "Your files are secured with top encryption." },
            { title: "Cloud Storage", desc: "Upload files and access them anytime." },
            { title: "Fast & Reliable", desc: "Fast upload and download speeds." },
          ].map((feature, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-md bg-white transition-transform transform hover:scale-105 duration-300">
              <h4 className="text-xl font-bold">{feature.title}</h4>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white text-center">
        <h3 className="text-3xl font-semibold text-gray-800">What Our Users Say</h3>
        <div className="mt-6 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            { name: "John Doe", review: "FileShare made it super easy to send files securely!" },
            { name: "Sarah Smith", review: "Fast & reliable. I use it daily for work!" },
          ].map((testimonial, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-md bg-gray-50">
              <p className="italic text-gray-700">"{testimonial.review}"</p>
              <h4 className="mt-4 font-semibold">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>© 2025 FileShare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
