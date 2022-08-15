import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: String,
  hashPassword: String,
  email: String,
  createdAccountAt: Number
});
export const UserModel = mongoose.model('User', UserSchema);
