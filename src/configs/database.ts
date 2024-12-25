import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_CLOUD_URI) {
      throw new Error("MONGODB_URI가 환경변수에 설정되지 않았습니다.");
    }

    // retryWrites 옵션을 명시적으로 설정
    const options = {
      retryWrites: true,
      w: "majority" as const,
    };

    await mongoose.connect(process.env.MONGO_CLOUD_URI, options);
    console.log("MongoDB Atlas 연결 성공");
  } catch (error) {
    console.error("MongoDB 연결 실패:", error);
    process.exit(1);
  }
};

export default connectDB;
