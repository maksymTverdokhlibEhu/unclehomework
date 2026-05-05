import express from "express";
import mongoose from "mongoose";
import vehicleController from "./routes/vehicleRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { connectRabbit } from "./rabbit/connectRabbit";
import { userConsumer } from "./rabbit/consumers/userCreated.consumer";
import { vehicleRpc } from "./rabbit/rpc/vehicle.rpc";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://admin:admin@localhost:27019/vehicle-service?authSource=admin";
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

app.use(vehicleController);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use(errorHandler);

async function bootstrap() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const { channel, connection } = await connectRabbit();

    await channel.assertExchange("user.events", "topic", {
      durable: true,
    });

    await channel.assertQueue("vehicle.queue", {
      durable: true,
    });
    await channel.bindQueue("vehicle.queue", "user.events", "user.*");
    await channel.bindQueue("vehicle.queue", "user.events", "vehicle.*");
    // await channel.bindQueue("user.queue", "user.events", "user.*");

    userConsumer(channel);
    // vehicleRpc(channel);

    app.locals.rabbitChannel = channel;

    app.listen(PORT, () => {
      console.log(`Vehicle service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
