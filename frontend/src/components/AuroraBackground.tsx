import React from "react";
import "../App.css";

function AuroraBackground() {
  return (
   <div className="min-h-screen w-full bg-[#0f172a] relative">
  {/* Blue Radial Glow Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)`,
    }}
  />
     {/* Your Content/Components */}
</div>
  );
}

export default AuroraBackground;
