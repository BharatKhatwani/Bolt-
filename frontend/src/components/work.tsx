const steps = [
  {
    number: "1",
    title: "Describe your website",
    description:
      "Tell us what kind of website you want to build. Be as specific as possible.",
  },
  {
    number: "2",
    title: "Edit and reprompt",
    description:
      "Edit the generated website to your liking. You can also reprompt to get a different design.",
  },
  {
    number: "3",
    title: "Download Zip",
    description:
      "Download the generated website as a zip file and host it anywhere you want.",
  },
];

export function Work() {
  return (
    <div id="how" className="py-20">
      <h2 className="text-3xl font-bold text-center text-gray-100 mb-12">
        How Bolt Works!
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-12 md:gap-20">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center max-w-sm">
            {/* Number Circle */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 text-gray-900 font-bold text-lg mb-6">
              {step.number}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-100 mb-3">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-base leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
