const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://matchmaker-api-o3cq.onrender.com"
    ],
    credentials: true
  })
);app.use(express.json());

app.get("/", (_req: any, res: any) => {
  res.json({
    success: true,
    message: "TDC Matchmaker Backend Running",
  });
});

const routes = require("./routes");

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
