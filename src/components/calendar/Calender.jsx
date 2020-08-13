import React, { Component, Fragment } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "popper.js/dist/popper";
import "bootstrap";
import { Modal } from "react-bootstrap";
import axios from "axios";
import Swal from 'sweetalert2';
import $ from 'jquery';

import ColorDisplay from "../color-display/color-display.component";



const colors = {
  Pending: "#5c6bc0",
  Approved: "#26a69a",
  Reject: "#d32f2f",
};



class Calender extends Component {
  constructor(props) {
    super(props);
    this.employeeRef = React.createRef();

    this.state = {
      is_logged: this.props.is_logged,
      user_id: this.props.user_id,
      leaveTypes: [],
      employeeList: [],
      employeeName: null,
      leaveTypeId: null,
      leaveAmount: null,
      startDate: null,
      endDate: null,
      reason: "",
      status: "Pending",
      supportiveEmployee: null,
      leaveDayType: null,
      leaveDayPart: null,
      startTime: null,
      endTime: null,
      needLeaveAllocationValidation: false,
      onAnError: null,
      color: colors["Pending"],

      events: [
        {
          title: "", // a property!
          start: "", // a property!
          end: "", // a property! ** see important note below about 'end' **
          url: "",
          color: "",
        },
      ],

      show: false,
      close: true,
    };
    this.onSubmit = this.onSubmit.bind(this);



  }

  //Show modal
  setShow = (e) => {
    this.setState({ show: true, startDate: e.dateStr, endDate: e.dateStr });
  };

  //Close modal
  setClose = () => {
    this.setState({ show: false });
  };

  getDateDiff = () => {
    const {startDate}  = this.state;
    const {endDate}  = this.state;
    if(startDate && endDate){
      const date1 = new Date(startDate);
      const date2 = new Date(endDate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays === 0 ? 1 : diffDays;

    }
  }

  addDays = (date, days = 1) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  getDateRange = (start, end, range = []) => {
    if (start > end) return range;
    const next = this.addDays(start, 1);
    return this.getDateRange(next, end, [...range, start]);
  };


  onSubmit(event) {
    event.preventDefault();

    // check the availability of the supportive employee
    // TODO: need to check supportive employee availability
    // if(this.state.supportiveEmployee){
    //   var endDateObj = new Date(this.state.endDate);
    //   const range = this.getDateRange(new Date(this.state.startDate), this.state.endDate === this.state.startDate ? endDateObj : endDateObj.setDate(endDateObj.getDate()-1));
    //   console.log(range)
    //
    // }

    if ((this.state.leaveTypes.find(leave => leave._id === this.state.leaveTypeId).day_range === "Single") && this.getDateDiff() > 1) {
      return Swal.fire({
        title: 'Oops!!!',
        text: 'You cannot select multiple days for a Single day based leave.',
        icon: 'error',
      })
    } else {
      const obj = {
        employeeId: this.state.employeeName,
        leaveTypeId: this.state.leaveTypeId,
        leaveAmount: this.getDateDiff(),
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        reason: this.state.reason,
        status: this.state.status,
        color: this.state.color,
        supportiveEmployeeId: this.state.supportiveEmployee,
        needLeaveAllocationValidation: this.state.needLeaveAllocationValidation,
        day_type: this.state.leaveDayType,
        day_range: this.state.leaveDayPart,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
      };
      axios
          .post("http://localhost:9000/calendarEvent/add", obj)
          .then((res) => {
            console.log(res.data);
            return res
            // window.location.href = '/calender'
          })
          .then((res) => {
            if (res.data.status) {
              axios
                  .get("http://localhost:9000/CalendarEvent")
                  .then((response) => {
                    const eventList = response.data.map((data) => {
                      return {
                        title: data.employeeId + " - " + data.status,
                        start: data.startDate,
                        end: data.endDate,
                        url: "http://localhost:3000/leaves/edit/" + data._id,
                        color: data.color,
                      };
                    });
                    console.log(eventList);
                    this.setState({events: eventList});
                    // window.location.href = "/";
                    Swal.fire({
                      title: 'YAY!!!',
                      text: 'Leave has been applied successfully. Will wait until your boss approves it :P',
                      icon: 'success',
                      timer: 1500
                    }).then(() => {
                      window.location.href = "/calendar";
                    })
                  })
                  .catch((error) => {
                    console.log(error.response)
                  });

              this.setState({
                employeeName: null,
                leaveTypeId: null,
                leaveAmount: null,
                startDate: null,
                endDate: null,
                reason: "",
                status: "Pending",
                color: colors["Pending"],
                supportiveEmployee: null,
                leaveDayType: null,
                leaveDayPart: null,
                startTime: null,
                endTime: null,
                needLeaveAllocationValidation: false,
                onAnError: null,
              });

            } else {
              this.setState({onAnError: res.data.calendarEvent})
            }

          });

    }
  }

  componentDidMount() {

    //calendar events hit to the full calendar
    //get the logged user's related employee
    axios
        .get("http://localhost:9000/user/edit/"+ this.state.user_id)
        .then((user) => {
          axios
              .get("http://localhost:9000/CalendarEvent/getEmpLeaves/" + user.employeeId._id)
              .then((response) => {
                const eventList = response.data.map((data) => {
                  //event loop
                  return {
                    //label of the calender event
                    title:
                        data.employeeId.first_name +
                        " " +
                        data.employeeId.last_name +
                        " - " +
                        data.status,

                    start: data.startDate,
                    end: data.endDate,
                    url:"http://localhost:3000/leaves/edit/" + data._id,

                    color: data.color,
                  };
                });
                console.log(eventList)

                this.setState({ events: eventList });
              })
              .catch((error) => console.log(error.response));
        })
        .catch((error) => console.log(error.response));


    axios
        .get("http://localhost:9000/employee")
        .then((response) => {
          this.setState({ employeeList: response.data });
        })
        .catch((error) => console.log(error.response));

    axios
        .get("http://localhost:9000/leaveType/active")
        .then((response) => {
          this.setState({ leaveTypes: response.data });
        })
        .catch((error) => console.log(error.response));
  }

  select = (e) => {
    var d = new Date(e.endStr);
    d.setDate(d.getDate());
    const endDate = d.toISOString()
    this.setState({ show: true, startDate: e.startStr, endDate: endDate.substring(0, 10) });
  };

  handleLeaveTypeChange = (e) => {
    const type = this.state.leaveTypes.find(type => type._id === e.target.value)
    const leaveTypeDiv = $('.leave-day-type-div');
    const leaveTimeDiv = $('.leave-day-time-div');
    if(['Full day', 'Half day', 'Both'].includes(type.day_type)){

      leaveTypeDiv.css("display", "block")
      leaveTimeDiv.css("display", "none")
      $('.leave-day-time-input').attr('required', false);
      switch(type.day_type) {
        case 'Full day':
          $('#leave-day-type-select').val('Full day');
          $('#leave-day-type-select').attr('required', true);
          $('#leave-day-type-select option').attr('disabled', true);
          this.setState({leaveDayType:'Full day'})

          // day part visibility
          $('.leave-day-part-div').css("display", "none");
          $('.leave-day-part-select').attr('required', false);
          break;
        case 'Half day':
          $('#leave-day-type-select').val('Half day');
          $('#leave-day-type-select').attr('required', true);
          $('#leave-day-type-select option').attr('disabled', true);
          this.setState({leaveDayType:'Half day'})

          // day part visibility
          $('.leave-day-part-div').css("display", "block");
          $('.leave-day-part-select').attr('required', true);
          break;
        case 'Both':
          $('#leave-day-type-select option').attr('disabled', false);
          $('#leave-day-type-select').attr('required', true)
          $('.leave-day-type-option-disabled').attr('disabled', true);

          // day part visibility
          $('.leave-day-part-div').css("display", "none");
          $('.leave-day-part-select').attr('required', false);
          break;
      }
    }else{
      leaveTypeDiv.css("display", "none");
      leaveTimeDiv.css("display", "block");
      $('#leave-day-type-select').attr('required', false);
      $('.leave-day-time-input').attr('required', true);

      // day part visibility
      $('.leave-day-part-div').css("display", "none");

    }

    //  supportive employee needed
    if(type.need_supportive){
      $('.supportive-emp-div').css("display", "block");
      $('.supportive-emp-select').attr('required', true);
    }else{
      $('.supportive-emp-div').css("display", "none");
      $('.supportive-emp-select').attr('required', false);
    }

    //  Leave Allocation Validation needed
    type.need_allocation ? this.setState({needLeaveAllocationValidation:true}) : this.setState({needLeaveAllocationValidation:false})
  }

  handleLeaveDayTypeChange = () => {
    if (this.state.leaveTypes.find(type => type._id === this.state.leaveTypeId).day_type === 'Both' && this.state.leaveDayType === 'Half day'){
      // day part visibility
      $('.leave-day-part-div').css("display", "block");
      $('.leave-day-part-select').attr('required', true);
    }else{
      // day part visibility
      $('.leave-day-part-div').css("display", "none");
      $('.leave-day-part-select').attr('required', false);
    }
  }

  render() {
    if((this.state.is_logged == undefined) || (!this.state.is_logged)){
      return (
          window.location.href = "/"
      )
    }
    else{
      return (

          <Fragment>

            <div className="content-wrapper">
              <section className="content-header">
                <h1>Calendar</h1>
                <ol className="breadcrumb">
                  <li>
                    <a href="#">
                      <i className="fa fa-users"></i> Home
                    </a>
                  </li>
                  <li>
                    <a href="#">Calendar</a>
                  </li>
                </ol>
              </section>
              <section className="content">
                <div className="row">
                  <div className="col-xs-12">
                    <div className="box">
                      <div className="box-body">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="">
                              <div className="row">
                                <div className="col-md-8 mb-4">
                                  <FullCalendar
                                      plugins={[dayGridPlugin, interactionPlugin]}
                                      initialView="dayGridMonth"
                                      headerToolbar={{
                                        left: "prev,next today",
                                        center: "title",
                                        right: "dayGridMonth,dayGridWeek,dayGridDay",
                                      }}
                                      weekends={false}
                                      dateClick={this.setShow}
                                      events={this.state.events}
                                      selectable={true}
                                      select={this.select}
                                  />

                                </div>
                                <div className="col-md-4">
                                  <table className="table table-bordered">
                                    <thead className="thead-light">
                                    <tr>
                                      <th scope="col">Leave Type</th>
                                      <th scope="col">Allocated</th>
                                      <th scope="col">Remaining</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                      <td scope="col">Annual Leaves</td>
                                      <td scope="col">
                                      <span className="badge badge-success badge-pill">
                                        14
                                      </span>
                                      </td>
                                      <td scope="col">
                                      <span className="badge badge-success badge-pill">
                                        5
                                      </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td scope="col">Casual Leaves</td>
                                      <td scope="col">
                                      <span className="badge badge-warning badge-pill">
                                        7
                                      </span>
                                      </td>
                                      <td scope="col">
                                      <span className="badge btn-warning badge-pill">
                                        0
                                      </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td scope="col">No Pay Leaves</td>
                                      <td scope="col" colSpan={2}>
                                      <span className="badge badge-danger badge-pill">
                                        0
                                      </span>
                                      </td>
                                    </tr>
                                    </tbody>
                                  </table>
                                  <ColorDisplay colors={colors}/>
                                </div>
                              </div>

                              {/*Leave Form Modal*/}
                              <Modal show={this.state.show}>
                                <Modal.Header closeButton>
                                  <Modal.Title>
                                    Leave Form
                                  </Modal.Title>

                                </Modal.Header>
                                <form onSubmit={this.onSubmit}>
                                  <Modal.Body>
                                    <div>
                                      <div className="form-group">
                                        <label className="float-left">
                                          Employee Name
                                        </label>
                                        <select
                                            className="form-control"
                                            required
                                            onChange={(e) =>
                                                this.setState({
                                                  employeeName: e.target.value,
                                                })
                                            }
                                        >
                                          <option
                                              selected="selected"
                                              disabled="disabled"
                                              value=''
                                          >
                                            Select employee
                                          </option>

                                          {this.state.employeeList.map(
                                              (employee) => (
                                                  <option
                                                      key={employee._id}
                                                      value={employee._id}
                                                  >
                                                    {employee.first_name}
                                                  </option>
                                              )
                                          )}
                                        </select>
                                      </div>

                                      <div className="form-group">
                                        <label className="float-left">
                                          Leave Type
                                        </label>
                                        <select
                                            type=""
                                            required
                                            className="form-control"
                                            onChange={(e) =>
                                                this.setState({
                                                  leaveTypeId: e.target.value,
                                                }, this.handleLeaveTypeChange(e))}
                                        >
                                          <option
                                              selected="selected"
                                              disabled="disabled"
                                              value=''
                                          >
                                            Select Leave Type
                                          </option>

                                          {this.state.leaveTypes.map(
                                              (leaveType) => (
                                                  <option
                                                      key={leaveType._id}
                                                      value={leaveType._id}
                                                  >
                                                    {leaveType.leaveType}
                                                  </option>
                                              )
                                          )}
                                        </select>
                                      </div>

                                      <div className="form-group leave-day-type-div" style={{
                                        display:'none'
                                      }}>
                                        <label className="float-left">
                                          Leave Category
                                        </label>
                                        <select
                                            className="form-control"
                                            id="leave-day-type-select"
                                            onChange={(e) =>
                                                this.setState({
                                                  leaveDayType: e.target.value,
                                                }, this.handleLeaveDayTypeChange)
                                            }
                                        >
                                          <option
                                              className='leave-day-type-option-disabled'
                                              selected
                                              disabled
                                              value=""
                                          >
                                            Select leave category
                                          </option>
                                          <option value="Full day">Full Day</option>
                                          <option value="Half day">Half Day</option>
                                        </select>
                                      </div>

                                      {/*day parts*/}
                                      <div className="form-group leave-day-part-div" style={{
                                        display:'none'
                                      }}>
                                        <label className="float-left">
                                          Day Part
                                        </label>
                                        <select
                                            className="form-control leave-day-part-select"
                                            onChange={(e) =>
                                                this.setState({
                                                  leaveDayPart: e.target.value,
                                                })
                                            }
                                        >
                                          <option
                                              selected
                                              disabled
                                              value=""
                                          >
                                            Select Day Part
                                          </option>
                                          <option value="Morning">Morning</option>
                                          <option value="Evening">Evening</option>
                                        </select>
                                      </div>

                                      {/*time pickers*/}
                                      <div className="row leave-day-time-div" style={{
                                        display:'none'
                                      }}>
                                        <div className="form-group col-md-6">
                                          <label className="float-left">
                                            Start Time
                                          </label>
                                          <input
                                              type="time"
                                              className="form-control leave-day-time-input"
                                              aria-describedby=""
                                              placeholder="Start Time"
                                              value={this.state.startTime}
                                              onChange={(e) =>
                                                  this.setState({
                                                    startTime: e.target.value,
                                                  })
                                              }
                                          />
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label className="float-left">
                                            End Time
                                          </label>
                                          <input
                                              type="time"
                                              className="form-control leave-day-time-input"
                                              aria-describedby=""
                                              placeholder="End Time"
                                              value={this.state.endTime}
                                              onChange={(e) =>
                                                  this.setState({
                                                    endTime: e.target.value,
                                                  })
                                              }
                                          />
                                        </div>
                                      </div>

                                      {/* Date Pickers */}
                                      <div className="row">
                                        <div className="form-group col-md-6">
                                          <label className="float-left">
                                            Start Date
                                          </label>
                                          <input
                                              type="text"
                                              className="form-control"
                                              readOnly={true}
                                              aria-describedby=""
                                              placeholder="Start Date"
                                              value={this.state.startDate}
                                              onChange={(e) =>
                                                  this.setState({
                                                    startDate: e.target.value,
                                                  }, this.handleDateChange(e))
                                              }
                                          />
                                        </div>
                                        <div className="form-group col-md-6">
                                          <label className="float-left">
                                            End Date
                                          </label>
                                          <input
                                              type="text"
                                              className="form-control"
                                              readOnly={true}
                                              aria-describedby=""
                                              placeholder="End Date"
                                              value={this.state.endDate}
                                              onChange={(e) =>
                                                  this.setState({
                                                    endDate: e.target.value,
                                                  }, this.handleDateChange(e))
                                              }
                                          />
                                        </div>
                                      </div>

                                      <div className="form-group supportive-emp-div" style={{
                                        display:'none'
                                      }}>
                                        <label className="float-left">
                                          Supportive Employee
                                        </label>
                                        <select
                                            className="form-control supportive-emp-select"
                                            onChange={(e) =>
                                                this.setState({
                                                  supportiveEmployee: e.target.value,
                                                })
                                            }
                                        >
                                          <option
                                              selected="selected"
                                              disabled="disabled"
                                              value=''
                                          >
                                            Select Supportive Employee
                                          </option>

                                          {this.state.employeeList.map(
                                              (employee) => (
                                                  <option
                                                      key={employee._id}
                                                      value={employee._id}
                                                  >
                                                    {employee.first_name +
                                                    " " +
                                                    employee.last_name}
                                                  </option>
                                              )
                                          )}
                                        </select>
                                      </div>

                                      <div className="form-group">
                                        <label className="float-left">Reason</label>
                                        <textarea
                                            className="form-control"
                                            id=""
                                            rows=""
                                            required
                                            value={this.state.reason}
                                            onChange={(e) =>
                                                this.setState({
                                                  reason: e.target.value,
                                                })
                                            }
                                        ></textarea>
                                      </div>
                                    </div>
                                    {
                                      this.state.onAnError ?
                                          <div className="alert alert-danger">
                                            <strong>Oops!</strong> {this.state.onAnError}
                                          </div> :
                                          null
                                    }

                                  </Modal.Body>
                                  <Modal.Footer>
                                    <button
                                        type={"reset"}
                                        className="btn btn-default"
                                        onClick={this.setClose}
                                    >
                                      Close
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        type="submit"
                                    >
                                      Apply
                                    </button>
                                  </Modal.Footer>
                                </form>
                              </Modal>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </Fragment>
      );
    }

  }
}


export default Calender;
