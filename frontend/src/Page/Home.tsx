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
          backgroundImage: `radial-gradient(circle 400px at 50% 20%, rgba(59,130,246,0.3), transparent)`,
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-2xl w-full flex flex-col items-center mt-20 sm:mt-24 md:mt-32">
          <div className="text-center mb-6 sm:mb-8">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 mb-3 sm:mb-4 px-4">
              Build Websites with <span className="text-blue-500">AI</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
              Fast. Smart. Effortless.
            </p>
          </div>

          {/* Hero Form */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full px-4">
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website you want to build..."
                className="w-full h-28 sm:h-32 md:h-36 p-3 sm:p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 text-sm sm:text-base"
              />
              <button
                type="submit"
                className="w-full cursor-pointer mt-3 sm:mt-4 bg-blue-600 text-gray-100 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Generate Website Plan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-2 sm:mb-3 px-4">
            Why Builder AI Stands Out
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
            Powerful features that make building websites effortless
          </p>
        </div>
        <Feature />
      </div>

      {/* Work Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <Work />
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <Accordion />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}