import React, {Component, Fragment, useState} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Employee from "../employee/Employee.jsx";
import LeaveAllocation from "../allocation/LeaveAllocation";
import Calender from "../calendar/Calender";
import LeaveResponse from "../leaves/leaveResponse";
import LeaveType from "../leaveType/LeaveType";
import Designation from "../designation/Designation";
import Holidays from "../holidays/Holidays.jsx";
import User from "../user/User";
import Login from "../login/Login";
// import Root from "../root/Root";
import Reset from "../reset/Reset";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const BaseRouter = ({location}) => {

    const [state, setState] = useState({
        user_logged: localStorage.getItem('userLogged'),
        is_logged: location ? location.log: false,
        id: location ? location.usr_id : false,
        name: localStorage.getItem('name')
    })

    return(
        <div>
            <Router>
                {/*  <Route exact path="/" component={Login} />*/}
                {/*<Route exact path="/calendar" component={Calender} />*/}
                {/*  /!*<Route exact path="/root" component={Root} />*!/*/}
                {/*<Route exact path="/employee" component={Employee} />*/}
                {/*<Route exact path="/leave_allocation" component={LeaveAllocation} />*/}
                {/*<Route exact path="/leaves/edit/:id" component={LeaveResponse} />*/}
                {/*<Route exact path="/leave_type" component={LeaveType} />*/}
                {/*<Route exact path="/designation" component={Designation} />*/}
                {/*<Route exact path="/public-holidays" component={Holidays} />*/}
                {/*  <Route exact path="/user" component={User}/>*/}
                {/*  <Route exact path="/login" component={Login}/>*/}
                {/*  <Route exact path="/reset" component={Reset}/>*/}

                <Route exact path="/calender"
                       component={() => <Calender is_logged={state.is_logged} user_id = {state.id} />}/>
                <Route exact path="/employee"
                       component={() => <Employee is_logged={state.is_logged}/>}/>
                <Route exact path="/leave_allocation"
                       component={() => <LeaveAllocation is_logged={state.is_logged}/>}/>
                <Route exact path="/leave_type"
                       component={() => <LeaveType is_logged={state.is_logged}/>}/>
                <Route exact path="/public-holidays"
                       component={() => <Holidays is_logged={state.is_logged}/>}/>
                <Route exact path="/designation"
                       component={() => <Designation is_logged={state.is_logged}/>}/>
                <Route exact path="/user"
                       component={() => <User is_logged={state.is_logged}/>}/>
                <Route exact path="/reset"
                       component={() => <Reset is_logged={state.is_logged} id={state.id}/>}/>


                <Route exact path="/"
                       component={() => <Login is_logged={state.is_logged} />}/>
            </Router>
        </div>
    )
};

export default BaseRouter;
