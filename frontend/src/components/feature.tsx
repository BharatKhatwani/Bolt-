"use client";

import { cn } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Zap, Code, Monitor, Download, Edit3, Eye } from "lucide-react";

export default function Feature() {
  const items = [
    {
      title: "No Login / Signup",
      description:
        "Access the platform instantly without creating an account or signing in.",
    
      icon: <Zap className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "AI-Powered Code Generation",
      description:
        "Describe your app and get the full codebase generated with React, Tailwind, and Node.js.",

      icon: <Code className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "Browser-Based Development Environment",
      description:
        "Run everything directly in your browser with zero local setup.",
    
      icon: <Monitor className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "One-Click Download / Deployment",
      description:
        "Download or deploy your generated app instantly with a single click.",
  
      icon: <Download className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "Customizable Code Editing",
      description:
        "Edit the generated code directly in the IDE for further refinement.",
      
      icon: <Edit3 className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "Real-Time Preview",
      description:
        "See your app live as you make changes or generate new code.",
      link: "#",
      icon: <Eye className="w-6 h-6 text-blue-400" />,
    },
  ];

  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div  id="features"
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-6 scroll-mt-48">
      {items.map((item, idx) => (
        <a
          href={item.link}
          key={item.title}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800 rounded-3xl block"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="flex items-center space-x-3 mb-4">{item.icon}</div>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
}

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-2", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-2 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
