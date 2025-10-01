import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-300 max-w-6xl mx-auto px-4">
        
        {/* Left side */}
        <div className="mb-4 md:mb-0 font-semibold text-lg">
          Bolt
        </div>

        {/* Right side with icons */}
        <div className="flex space-x-6">
          <a 
            href="https://github.com/your-profile" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center space-x-1 hover:text-black dark:hover:text-white transition-colors"
          >
            <Github size={18} />
            <span>GitHub</span>
          </a>
          <a 
            href="https://linkedin.com/in/your-profile" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center space-x-1 hover:text-black dark:hover:text-white transition-colors"
          >
            <Linkedin size={18} />
            <span>LinkedIn</span>
          </a>
          <a 
            href="https://twitter.com/your-profile" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center space-x-1 hover:text-black dark:hover:text-white transition-colors"
          >
            <Twitter size={18} />
            <span>Twitter</span>
          </a>
        </div>
      </div>
      
      <div className="text-center mt-4 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Bolt. All Rights Reserved.
      </div>
    </footer>
  );
}
