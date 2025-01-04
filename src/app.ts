import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
import githubRouter from "./routes/auth";
import connectDB from "./configs/database";

import path from "path";
const swaggerSpec = YAML.load(
  path.join(__dirname, "../dist/swagger/openapi.yaml")
);

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
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

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
