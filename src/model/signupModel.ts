import { model, Schema } from "mongoose";

const signupSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  dob: String,
  mobileNo: { type: [String], required: true },
  auth: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

export const signupModel = model("user", signupSchema);
