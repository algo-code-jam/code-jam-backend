import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import githubRouter from "./routes/auth";
import connectDB from "./configs/database";

const path = require("path");
const swaggerSpec = YAML.load(path.join(__dirname, "swagger/openapi.yaml"));

dotenv.config();

const app = express();

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
