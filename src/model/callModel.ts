import { model, Schema } from "mongoose";
import { companyModel } from "./companyModel";
import { signupModel } from "./signupModel";

const actionSchema = new Schema(
  {
    actionTaken: { type: String, required: true },
    actionStarted: { type: Number, required: true },
    employee: { type: Schema.Types.ObjectId, ref: signupModel, required: true },
  },
  { _id: false }
);

const callSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  callDescription: String,
  contactPerson: String,
  companyName: {
    type: Schema.Types.ObjectId,
    ref: companyModel,
  },
  email: String,
  mobile: [String],
  assignedEmployeeId: {
    type: Schema.Types.ObjectId,
    ref: signupModel,
    required: true,
  },
  registeredBy: {
    type: Schema.Types.ObjectId,
    ref: signupModel,
    required: true,
  },
  callStatus: { type: String, required: true },
  startDate: { type: Number, required: true },
  endDate: Number,
  startAction: String,
  problemType: { type: String, required: true }, //TODO: Add this as ref to problemType schema
  expClosure: { type: Number, required: true },
  actions: [actionSchema],
});

export const callModel = model("call", callSchema);
