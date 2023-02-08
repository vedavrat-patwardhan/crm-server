import { RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import { CallInterface, SignupInterface } from "../config/interfaces";
import { callModel } from "../model/callModel";
import { signupModel } from "../model/signupModel";

export const genId = (id: string) => {
  const today = new Date();
  today.setHours(today.getHours() + 9);
  today.setMinutes(today.getMinutes() + 30);
  const yyyy = today.getFullYear().toString();
  const mm = ("0" + (today.getMonth() + 1)).slice(-2);
  const dd = ("0" + today.getDate()).slice(-2);
  if (id.toString().includes(yyyy + mm + dd)) {
    return (parseInt(id) + 1).toString();
  } else {
    return yyyy + mm + dd + "01";
  }
};
let callCounter: number;
const getCall = (
  find: {},
  filterData: {
    page: string;
    itemsPerPage: string;
    res: Response;
    search: any;
    filters: any;
  }
) => {
  if (filterData.search || filterData.filters) {
    return callModel
      .find({
        ...find,
        callStatus: { $ne: "Completed" },
      })
      .sort({ id: -1 })
      .populate("assignedEmployeeId", "name")
      .populate("registeredBy", "name")
      .populate("companyName", "name")
      .populate("actions.employee", "name")
      .then((calls: any) => {
        const filteredData = calls.filter((call: any) => {
          return (
            call.startDate > +filterData.filters &&
            (call.id.toString().includes(filterData.search) ||
              (call.companyName &&
                call.companyName.name
                  .toLowerCase()
                  .includes(filterData.search)) ||
              call.assignedEmployeeId.name
                .toLowerCase()
                .includes(filterData.search))
          );
        });
        callCounter = filteredData.length;
        filterData.res.status(200).json({
          calls: filteredData.slice(
            (+filterData.page - 1) * +filterData.itemsPerPage,
            +filterData.page * +filterData.itemsPerPage
          ),
          totalCalls: callCounter,
        });
      });
  } else {
    callModel
      .find({
        ...find,
        callStatus: { $ne: "Completed" },
      })
      .count()
      .then((callCount: number) => {
        callCounter = callCount;
        return callModel
          .find({
            ...find,
            callStatus: { $ne: "Completed" },
          })
          .sort({ id: -1 })
          .skip((+filterData.page - 1) * +filterData.itemsPerPage)
          .limit(+filterData.itemsPerPage)
          .populate("assignedEmployeeId", "name")
          .populate("registeredBy", "name")
          .populate("companyName", "name")
          .populate("actions.employee", "name");
      })
      .then((result: any) =>
        filterData.res
          .status(200)
          .json({ calls: result, totalCalls: callCounter })
      )
      .catch((error: any) => {
        filterData.res.status(400).json(error);
      });
  }
};
export const getCalls: RequestHandler = (req, res) => {
  const { page, _id, itemsPerPage } = req.params;
  let { search, filters } = req.query;
  search = search || "";
  filters = filters || "";
  const filterData: {
    page: string;
    itemsPerPage: string;
    res: Response;
    search: any;
    filters: any;
  } = { page, itemsPerPage, res, search, filters };
  signupModel.findById(
    _id,
    { auth: 1, _id: 1 },
    (err: any, foundUser: SignupInterface) => {
      const id = foundUser._id;
      if (err) {
        return res.status(400).json(err);
      }
      switch (foundUser.auth) {
        case "user":
          getCall({ assignedEmployeeId: id }, filterData);
          break;
        case "admin":
          getCall({ isSales: false }, filterData);
          break;
        case "sales admin":
          getCall({ isSales: true }, filterData);
          break;
        default:
          res.status(400).json("Invalid auth");
          break;
      }
    }
  );
};

export const createCall: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { _id } = req.params;
  callModel
    .findOne({}, { id: 1 }, { sort: { id: -1 } })
    .then((result: { id: string; _id: string }) => {
      const id = genId(result.id);
      const newCall = new callModel(req.body);
      newCall.id = id;
      newCall.registeredBy = _id;
      newCall
        .save()
        .then(() => {
          res.status(201).json("Call created");
        })
        .catch((err: any) => {
          res.status(400).json(err);
        });
    })
    .catch(() => {
      const id = genId("0");
      const newCall = new callModel(req.body);
      newCall.id = id;
      newCall.registeredBy = _id;
      newCall
        .save()
        .then(() => {
          res.status(201).json("Call created");
        })
        .catch((err: any) => {
          res.status(400).json(err);
        });
    });
};

export const createAmcCalls = (res: Response, data: CallInterface[]) => {
  callModel
    .findOne({}, { id: 1 }, { sort: { id: -1 } })
    .then((result: { id: string; _id: string }) => {
      const id = genId(result.id);
      const newCall: CallInterface[] = [];
      data.forEach((call: CallInterface, index: number) => {
        let newCallObj = { ...call };
        newCallObj.id = +id + index;
        newCall.push(newCallObj);
      });
      callModel.collection.insertMany(newCall, (err: any, docs: any) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(201).json("Amc calls added");
        }
      });
    });
};
export const updateCall: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const updatedCall = new callModel(req.body);
  callModel
    .findByIdAndUpdate(req.body._id, updatedCall)
    .then(() => res.status(203).json("Call updated"))
    .catch((err: any) => res.status(400).json(err));
};

export const deleteCall: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  callModel
    .findByIdAndDelete(req.params.callId)
    .then(() => res.status(202).json("Call deleted"))
    .catch((err: any) => res.status(404).json(err));
};

export const addAction: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  callModel
    .findById(req.body._id)
    .then((result: CallInterface) => {
      result.actions.push({
        actionTaken: req.body.actionTaken,
        actionStarted: req.body.actionStarted,
        employee: req.body.employee,
      });
      result.assignedEmployeeId = req.body.employee;
      if (req.body.complete) {
        result.callStatus = "Completed";
        result.endDate = new Date().getTime();
      } else {
        result.callStatus = "In Progress";
      }
      if (!result.startAction) {
        result.startAction = new Date().toLocaleDateString();
      }
      callModel
        .findByIdAndUpdate(req.body._id, result)
        .then(() => {
          res.status(201).json("Action added");
        })
        .catch((err: any) => res.status(404).json(err));
    })
    .catch((err: any) => res.status(404).json(err));
};

export const companyReport: RequestHandler = (req, res) => {
  const { companyId, startDate, endDate } = req.params;
  callModel
    .find({
      callStatus: "Completed",
    })
    .populate("registeredBy", "name")
    .populate("assignedEmployeeId", "name")
    .then((foundCalls: any) => {
      if (foundCalls) {
        const filteredCalls = foundCalls.filter(
          (call: CallInterface) =>
            call.companyName &&
            call.companyName.toString() === companyId &&
            call.endDate! <= +endDate &&
            call.startDate >= +startDate
        );
        res.status(200).json(filteredCalls);
      } else {
        res.status(404).json("Company not found");
      }
    })
    .catch((err: any) => res.status(404).json(err));
};

export const employeeReport: RequestHandler = (req, res) => {
  const { employeeId, startDate, endDate } = req.params;
  callModel
    .find({ assignedEmployeeId: employeeId, callStatus: "Completed" })
    .populate("registeredBy", "name")
    .populate("companyName", "name")
    .then((foundCalls: any) => {
      if (foundCalls) {
        const filteredCalls = foundCalls.filter(
          (call: CallInterface) =>
            new Date(call.startDate).getTime() >= +startDate &&
            new Date(call.endDate!).getTime() <= +endDate
        );
        res.status(200).json(filteredCalls);
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err: any) => res.status(404).json(err));
};

// export const addData: RequestHandler = (req, res) => {
//   const oldDate: any[] = [];
//   req.body.forEach((call: CallInterface) => {
//     let tempArr: any[] = [];
//     call.actions.forEach((action: any) => {
//       const tempAction = {
//         ...action,
//         employee: new Types.ObjectId(action.employee),
//       };
//       tempArr.push(tempAction);
//     });
//     oldDate.push({
//       ...call,
//       actions: tempArr,
//       companyName: new Types.ObjectId(call.companyName),
//       registeredBy: new Types.ObjectId(call.registeredBy),
//       assignedEmployeeId: new Types.ObjectId(call.assignedEmployeeId),
//     });
//   });
//   console.log(oldDate[0]);
//   callModel.collection.insertMany(oldDate, (err: any, result: any) => {
//     if (err) {
//       return res.status(400).json(err);
//     } else {
//       res.status(200).json("Calls added");
//     }
//   });
// };
