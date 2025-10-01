import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is Bolt?",
    answer:
      "Bolt is an AI-powered website builder that helps you create responsive websites by simply describing your idea.",
  },
  {
    question: "Do I need coding knowledge?",
    answer:
      "Not at all! Bolt is designed for everyone. Beginners can use it without coding, while developers can customize the code if they want.",
  },
  {
    question: "Can I export the website?",
    answer:
      "Yes, you can export the generated website as a complete codebase and host it on any platform of your choice.",
  },
  {
    question: "Is Bolt free to use?",
    answer:
      "Bolt provides both free and premium plans. Free plans have some limitations, while premium unlocks advanced features.",
  },
  {
    question: "What technologies does Bolt use?",
    answer:
      "Bolt uses modern frameworks like React, Tailwind CSS, and integrates with AI models to generate code and content.",
  },
  {
    question: "Can I deploy directly from Bolt?",
    answer:
      "Yes! Bolt allows one-click deployment to hosting providers so your website goes live instantly.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. Bolt does not share your project data with anyone. Your code and ideas remain private and secure.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Absolutely. Bolt supports team collaboration where multiple members can edit and build the website together.",
  },
];

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
  <div id="faq" className="max-w-3xl mx-auto  py-16 px-4 scroll-mt-10">

      <h2 className="text-3xl font-bold text-center text-gray-100 mb-10">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-lg bg-gray-800"
          >
            {/* Question */}
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center p-4 text-left text-gray-200 font-medium"
            >
              {faq.question}
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
