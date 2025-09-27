import express from "express";
// import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.js";
import templateRouter from "./routes/template.js";

dotenv.config();

const app = express();
// app.use(cors());
app.use(express.json());

app.use("/template", templateRouter); // Determines project type
app.use("/chat", chatRouter);         // Generates code/chat based on project type

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
