import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.js";
import templateRouter from "./routes/template.js";

dotenv.config(); // loads .env automatically

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/template", templateRouter);
app.use("/chat", chatRouter);

// Use PORT from environment (Railway or local)
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
