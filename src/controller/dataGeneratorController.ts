import { RequestHandler } from "express";
import { callModel } from "../model/callModel";

export const getCallDetails: RequestHandler = async (req, res) => {
  const { fromTime, toTime } = req.query;

  if (!fromTime || !toTime) {
    return res.status(400).json({
      message: "Please provide a valid fromTime and toTime",
    });
  }
  // Query the database
  const calls = await callModel
    .find({
      startDate: {
        $gte: +fromTime,
        $lte: +toTime,
      },
    })
    .populate("companyName", "name")
    .populate("assignedEmployeeId", "name")
    .populate("actions.employee", "name");

  // Transform the data
  const data = calls.map((call) => ({
    companyDetails: call.companyName.name,
    initiallyAssignedEmployee: call.assignedEmployeeId.name,
    Engineers: [
      ...new Set(
        call.actions
          .filter((action: any) => action.employee?.name)
          .map((action: any) => action.employee.name)
      ),
    ].join(", "),
    callType: call.problemType,
  }));

  res.status(200).json(data);
};
