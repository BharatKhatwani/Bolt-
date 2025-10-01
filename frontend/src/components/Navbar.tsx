import React from "react";
import { Link } from "react-router-dom"; // corrected import

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 left-0 z-20 bg-[#0f172a] border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
      <Link
  to="/"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  className="text-2xl font-bold text-blue-400"
>
  Bolt
</Link>


        {/* Links */}
        <div className="flex space-x-8 text-gray-300 font-medium">
          <a href="#how" className="hover:text-blue-400 transition-colors">
            How it Works
          </a>
          <a href="#features" className="hover:text-blue-400 transition-colors">
            Features
          </a>
          <a href="#faq" className="hover:text-blue-400 transition-colors">
            FAQ
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
