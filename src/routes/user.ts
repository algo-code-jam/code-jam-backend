import express, { Request, Response } from "express";
const userRouter = express.Router();

userRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello hello user route");
});

export default userRouter;
