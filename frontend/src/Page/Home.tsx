import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Feature from "../components/feature";
import { Work } from "../components/work";
import Accordion from "../components/Accordian";
import Footer from "../components/fotter";

export function Home() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate("/builder", { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] overflow-y-auto relative">
      {/* Global Background Glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle 600px at 50% 20%, rgba(59,130,246,0.3), transparent)`,
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 max-w-2xl w-full flex flex-col items-center mt-32">
          <div className="text-center mb-8">
            {/* Hero Icon */}
           
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
              Build Websites with <span className="text-blue-900">AI</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-gray-300">
              Fast. Smart. Effortless.
            </p>
          </div>

          {/* Hero Form */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website you want to build..."
                className="w-full h-32 p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
              />
              <button
                type="submit"
                className="w-full cursor-pointer mt-4 bg-blue-600 text-gray-100 py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Generate Website Plan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-100 mb-3">
            Why Builder AI Stands Out
          </h2>
          <p className="text-xl text-gray-400">
            Powerful features that make building websites effortless
          </p>
        </div>
        <Feature />
      </div>

      {/* Work Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <Work />
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <Accordion />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
