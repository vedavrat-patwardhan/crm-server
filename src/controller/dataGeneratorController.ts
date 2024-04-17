import { RequestHandler } from "express";
import { callModel } from "../model/callModel";

export const getCallDetails: RequestHandler = async (req, res) => {
  const { fromTime, toTime } = req.query;
  const fromTimeInSec = new Date(fromTime as string).getTime();
  const toTimeInSec = new Date(toTime as string).getTime();

  // Query the database
  const calls = await callModel
    .find({
      startDate: {
        $gte: fromTimeInSec,
        $lte: toTimeInSec,
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
