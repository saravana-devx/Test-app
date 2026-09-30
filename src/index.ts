import express from "express";
import taskRoutes from "./routes/tasks";
import userRoutes from "./routes/users";

const app = express();
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dummy Task API running on port ${PORT}`);
});

export default app;
