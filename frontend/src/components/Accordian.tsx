import { useState } from "react";
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
    question: "What technologies does Bolt use?",
    answer:
      "Bolt uses modern frameworks like React and Tailwind CSS, and integrates AI models to generate code and content.",
  },
  {
    question: "Can I deploy directly from Bolt?",
    answer:
      "Yes! Download the zip file, set it up locally, and deploy it on free hosting platforms like Vercel or Netlify.",
  },
  {
    question: "Can I export the code?",
    answer: "Yes, you can export the generated code as a zip file and host it anywhere.",
  },
  {
    question: "Does Bolt support custom domains?",
    answer: "Absolutely! You can link your custom domain when deploying your website.",
  },
  {
    question: "Can I edit the website after creation?",
    answer: "Yes, you can modify the content, layout, and styling anytime after generating the site.",
  },
  {
    question: "Is Bolt mobile-friendly?",
    answer: "Every website generated with Bolt is fully responsive and works on all devices.",
  },
  {
    question: "How does AI help in building websites?",
    answer: "AI assists by generating layouts, content, and code based on your input and preferences.",
  },
  {
    question: "Do I need an account to use Bolt?",
    answer: "No, simply provide a prompt and see the results instantly.",
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
