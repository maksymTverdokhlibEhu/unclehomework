import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import userController from "./routes/userRoutes";
import { connectRabbit } from "./rabbit/connectRabbit";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://admin:admin@localhost:27018/user-service?authSource=admin";
const defaultCorsOrigin = "http://localhost:5173";
const corsOrigins = new Set(
  [defaultCorsOrigin, ...(process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)],
);

// CORS middleware
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (requestOrigin && corsOrigins.has(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
  } else {
    res.header("Access-Control-Allow-Origin", defaultCorsOrigin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());
app.use(userController);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

async function bootstrap() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const { channel, connection } = await connectRabbit();

    await channel.assertExchange("user.events", "topic", {
      durable: true,
    });

    await channel.assertQueue("user.queue", {
      durable: true,
    });
    
    await channel.bindQueue("user.queue", "user.events", "user.*");

    app.locals.rabbitChannel = channel;

    app.listen(PORT, () => {
      console.log(`User service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
