export interface CompanyInterface {
  name: string;
  contactPerson: { name: string; mobile: string[]; email: string }[];
  streetAddress: string;
  city: string;
  state: string;
  pincode: number;
  amc: { maintain: boolean; week?: number; day?: number; employee?: string };
  weeklyOff?: string[];
}

export interface SignupInterface {
  _id?: string;
  name: string;
  email: string;
  password: string;
  dob: string;
  mobileNo: string[];
  auth: string;
}

export interface CallInterface {
  id: number;
  streetAddress: string;
  city: string;
  state: string;
  pincode: number;
  companyName?: string;
  customerName: string;
  email?: string;
  mobile?: string[];
  assignedEmployeeId: string;
  registeredBy: string;
  callStatus: string;
  startDate: number;
  endDate?: number;
  startAction?: string;
  problemType: string;
  expClosure: number;
  actions: { actionTaken: string; actionStarted: number; employee: string }[];
  callDescription: string;
}
