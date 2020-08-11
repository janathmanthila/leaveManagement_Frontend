import React from "react";
import { Route } from "react-router-dom";
import Employee from "../employee/Employee.jsx";
import LeaveAllocation from "../allocation/LeaveAllocation";
import Calender from "../calendar/Calender";
import LeaveResponse from "../leaves/leaveResponse";
import LeaveType from "../leaveType/LeaveType";
import Designation from "../designation/Designation";
import Holidays from "../holidays/Holidays.jsx";

const BaseRouter = () => (
  <div>
    <Route exact path="/" component={Calender} />
    <Route exact path="/employee" component={Employee} />
    <Route exact path="/leave_allocation" component={LeaveAllocation} />
    <Route exact path="/leaves/edit/:id" component={LeaveResponse} />
    <Route exact path="/leave_type" component={LeaveType} />
    <Route exact path="/designation" component={Designation} />
    <Route exact path="/public-holidays" component={Holidays} />
  </div>
);

export default BaseRouter;
