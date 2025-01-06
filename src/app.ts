import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
import githubRouter from "./routes/auth";
import connectDB from "./configs/database";
import MongoStore from "connect-mongo";

import mongoose from "mongoose";
import path from "path";
const swaggerSpec = YAML.load(
  path.join(__dirname, "../dist/swagger/openapi.yaml")
);

dotenv.config();

const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false, // 세션 데이터가 변경되지 않아도 세션을 저장하지 않음
    saveUninitialized: false, // 세션이 초기화되지 않아도 세션을 저장하지 않음
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1일 쿠키 만료 시간
    }, // HTTPS 사용 여부
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_CLOUD_URI,
      ttl: 24 * 60 * 60, // 1일
      autoRemove: "native",
      mongoOptions: {
        retryWrites: true,
        w: "majority" as const,
      },
      crypto: {
        secret: process.env.SESSION_SECRET || "secret",
      },
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000;

app.get("/api", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/auth", githubRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
