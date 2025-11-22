import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import participantsRouter from "./routes/participants.js";
import coursesRouter from "./routes/courses.js";
import enrollmentsRouter from "./routes/enrollments.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// route buat testing
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// routes untuk manipulasi datanya
app.use("/api/participants",participantsRouter);
app.use("/api/courses",coursesRouter);
app.use("/api/enrollments",enrollmentsRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
