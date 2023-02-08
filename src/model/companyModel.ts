import { model, Schema } from "mongoose";
import { signupModel } from "./signupModel";
const personDetailsSchema = new Schema(
  {
    name: String,
    mobile: [String],
    email: String,
  },
  { _id: false }
);

const companySchema = new Schema({
  name: { type: String, required: true, unique: true },
  contactPerson: [personDetailsSchema],
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  hasAmc: { type: Boolean, required: true },
  amc: [
    {
      week: { type: Number, enum: [0, 1, 2, 3, 4] }, //* 0: Daily/Weekly , 1-4: Week count
      day: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6] }, //* 0: Sunday ---> 6: Saturday
      employee: { type: Schema.Types.ObjectId, ref: signupModel },
    },
  ],
  weeklyOff: [String],
});

export const companyModel = model("company", companySchema);
