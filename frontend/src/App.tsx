// App.tsx
//import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AuroraBackground from "./components/AuroraBackground";
import { Home } from "./Page/Home";
import {Builder} from "./Page/Builder";
function App() {
  return (


<>
<BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes here */}
             <Route path="/builder" element={<Builder />} />
        </Routes>
      </BrowserRouter>
</>
    

   
  );
}

export default App;
