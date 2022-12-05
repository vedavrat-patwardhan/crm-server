import { model, Schema } from "mongoose";
import { signupModel } from "./signupModel";
const personDetailsSchema = new Schema({
  name: String,
  mobile: [String],
  email: String,
});

const companySchema = new Schema({
  name: { type: String, required: true, unique: true },
  contactPerson: [personDetailsSchema],
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  amc: {
    maintain: { type: Boolean, required: true },
    week: Number,
    day: Number,
    employee: { type: String, ref: signupModel },
  },
  weeklyOff: [String],
});

export const companyModel = model("company", companySchema);
