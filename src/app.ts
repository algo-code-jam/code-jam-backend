import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import githubRouter from "./routes/auth";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/auth", githubRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});