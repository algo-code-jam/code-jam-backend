import express from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import User from "../models/User";
dotenv.config();

const githubRouter = express.Router();

// GitHub 전략 설정
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:4000/api/auth/github/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        const { id, username, email, displayName, node_id } = profile;

        let user = await User.findOne({ githubId: id });

        if (!user) {
          user = await User.create({
            githubId: id,
            username: displayName,
            accessToken: accessToken,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// 세션에 사용자 정보 저장
passport.serializeUser((user: any, done) => {
  done(null, user);
});

// 세션에서 사용자 정보 복원
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// GitHub 로그인 시작
githubRouter.get(
  "/login",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub 콜백 처리
githubRouter.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // 로그인 성공 시 처리
    res.json({ message: "GitHub 로그인 성공", user: req.user });
  }
);

// 로그아웃
githubRouter.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "로그아웃 완료" });
  });
});

export default githubRouter;
