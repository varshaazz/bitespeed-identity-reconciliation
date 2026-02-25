import express from "express";
import dotenv from "dotenv";
import identifyRoutes from "./routes/identify.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", identifyRoutes);

app.get("/", (req, res) => {
  res.send("BiteSpeed Identity Service Running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});