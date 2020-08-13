// import React, { Component, Fragment } from "react";
// import {BrowserRouter as Router, Route} from "react-router-dom";
// import Header from "../layout/Header";
// import Footer from "../layout/Footer";
// import BaseRouter from "../router/Router";
// import Calender from "../calendar/Calender";
// import Employee from "../employee/Employee";
// import LeaveAllocation from "../allocation/LeaveAllocation";
// import LeaveType from "../leaveType/LeaveType";
// import Holidays from "../holidays/Holidays";
// import Designation from "../designation/Designation";
// import User from "../user/User";
// import Login from "../login/Login";
// // import TestPost from "../test/TestPost";
// import Reset from "../reset/Reset";
//
//
// class Root extends Component {
//
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             user_logged: localStorage.getItem('userLogged'),
//             is_logged: this.props.location.log,
//             id: this.props.location.usr_id,
//             name: localStorage.getItem('name')
//         }
//
//     }
//
//
//     render() {
//         if ((this.state.user_logged == undefined) || (!this.state.user_logged)) {
//             return (
//                 window.location.href = "/"
//             )
//         } else {
//             return (
//                 <div className="App">
//                     <Fragment>
//                         <div className="wrapper">
//                             <Router>
//                                 <Header id={this.state.id} user_name={this.state.name}/>
//                                 {/*<Calender is_logged={this.state.is_logged}></Calender>*/}
//                                 {/*<Route exact path="/" component={Calender} />*/}
//
//                                 <Route exact path="/"
//                                        component={() => <Calender is_logged={this.state.is_logged} user_id = {this.state.id} />}/>
//                                 <Route exact path="/employee"
//                                        component={() => <Employee is_logged={this.state.is_logged}/>}/>
//                                 <Route exact path="/leave_allocation"
//                                        component={() => <LeaveAllocation is_logged={this.state.is_logged}/>}/>
//                                 <Route exact path="/leave_type"
//                                        component={() => <LeaveType is_logged={this.state.is_logged}/>}/>
//                                 <Route exact path="/public-holidays"
//                                        component={() => <Holidays is_logged={this.state.is_logged}/>}/>
//                                 <Route exact path="/designation"
//                                        component={() => <Designation is_logged={this.state.is_logged}/>}/>
//                                 <Route exact path="/user"
//                                        component={() => <User is_logged={this.state.is_logged}/>}/>
//                                 <Route exact path="/reset"
//                                        component={() => <Reset is_logged={this.state.is_logged} id={this.state.id}/>}/>
//
//
//                                 {/*<Route exact path="/login"*/}
//                                 {/*       component={() => <Login is_logged={this.state.is_logged} />}/>*/}
//                                 {/*<Route exact path="/test" component={TestPost}/>*/}
//                                 <Footer/>
//                             </Router>
//                         </div>
//                     </Fragment>
//                 </div>
//             );
//         }
//     }
// }
//
// export default Root;
