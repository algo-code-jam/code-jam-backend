import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  githubId: string;
  userName: string;
  accessToken: string;
  nodeId: string;
} // 인터페이스 생성

const userSchema = new Schema({
  githubId: { type: String, required: true },
  userName: { type: String, required: true },
  accessToken: { type: String, required: true },
  nodeId: { type: String, required: true },
}); // 스키마 생성

const UserModel = mongoose.model<IUser>("User", userSchema); // 모델 생성

class User {
  constructor(
    public githubId: string,
    public userName: string,
    public accessToken: string,
    public nodeId: string
  ) {}

  static findOne(query: any) {
    return UserModel.findOne(query);
  }
  static create(userData: IUser) {
    return UserModel.create(userData);
  }
}

export default User;
export { IUser };
