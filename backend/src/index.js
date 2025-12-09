import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import shopRoutes from "./routes/shop.route.js";
import notificationRoutes from "./routes/notification.route.js";
import bookRoutes from "./routes/book.route.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/books", bookRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});
