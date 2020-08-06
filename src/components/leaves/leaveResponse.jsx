import React, { Component } from "react";
import axios from "axios";
import {Modal} from "react-bootstrap";
import "bootstrap";
import $ from "jquery";
import Swal from "sweetalert2";
// import {formatDate, formatLongDate} from "react-calendar/dist/umd/shared/dateFormatter";
// import Moment from 'react-moment';

class LeaveResponse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeList: [],
      leaveTypes: [],
      employeeName: null,
      leaveTypeId: null,
      leaveDayType: null,
      leaveDayPart: null,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      supportiveEmployee: null,
      reason: null,
      reject_reason: null,
      status: null,
      isEditMode: false
    };
  }

  componentDidMount() {
    axios
        .get("http://localhost:9000/employee")
        .then((response) => {
          this.setState({ employeeList: response.data });
          //get leave types
          axios
              .get("http://localhost:9000/leaveType/active")
              .then((response) => {
                this.setState({ leaveTypes: response.data });

                //  get leave data
                axios
                    .get(
                        "http://localhost:9000/CalendarEvent/edit/" + this.props.match.params.id
                    )
                    .then((response) => {
                      this.setState({
                        employeeName:
                            response.data.employeeId.first_name +
                            " " +
                            response.data.employeeId.last_name,
                        leaveTypeId: response.data.leaveTypeId,
                        leaveDayType: response.data.day_type,
                        leaveDayPart: response.data.day_range,
                        startTime: response.data.startTime,
                        endTime: response.data.endTime,
                        startDate: response.data.startDate.slice(0, 10),
                        endDate: response.data.endDate.slice(0, 10),
                        supportiveEmployee:
                            response.data.supportiveEmployeeId ?
                                response.data.supportiveEmployeeId.first_name +
                                " " +
                                response.data.supportiveEmployeeId.last_name : null,
                        reason: response.data.reason,
                        id: response.data._id,
                        email: response.data.email,
                        status: response.data.status,
                      }, () => {
                        this.handleLeaveTypeChange(null, response.data.leaveTypeId);
                        // this.handleLeaveDayTypeChange();
                      });
                    })
                    .catch(function (error) {
                      console.log(error);
                    });

              })
              .catch((error) => console.log(error.response));
        })
        .catch((error) => console.log(error.response));


  }

  approved = (event) => {
    const obj = {
      id: this.state.id,
      email: this.state.email,
    };
    axios
        .post("http://localhost:9000/calendarEvent/approved/", obj)
        .then((res) => {
          console.log(res.data);
          window.location.href = "/";
        });
  };

  rejected = (event) => {
    const obj = {
      id: this.state.id,
      email: this.state.email,
      reject_reason: this.state.reject_reason,
    };
    axios
        .post("http://localhost:9000/calendarEvent/reject/", obj)
        .then((res) => {
          console.log(res.data);
          window.location.href = "/";
        });
  };

  makeEditable = () => {
    if(this.state.isEditMode){
      $('#response-fieldset').attr('disabled', 'true')
      $('#response-edit-btn-text').html('Edit')
    }else{
      $('#response-fieldset').removeAttr('disabled')
      $('#response-edit-btn-text').html('Discard')
    }

    this.setState({isEditMode:!this.state.isEditMode})

  }

  deleteLeave = () => {
    const id = this.state.id
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        axios
            .delete("http://localhost:9000/calendarEvent/delete/" + id)
            .then((res) => {
              Swal.fire({
                title: 'YAY!!!',
                text: 'Leave has been deleted successfully',
                icon: 'success',
                timer: 1000
              }).then(() => {
                window.location.href = "/";
              })
            })
            .catch((error) => {
              console.log(error);
              alert(
                  "Cannot delete this Leave"
              );
            });
      }
    })
  }

  handleLeaveTypeChange = (e=null, id=null) => {
    const val = e ? e.target.value : id;
    const type = this.state.leaveTypes.find(type => type._id === val);
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

          // day part visibility
          $('.leave-day-part-div').css("display", "none");
          $('.leave-day-part-select').attr('required', false);
          break;
        case 'Half day':
          $('#leave-day-type-select').val('Half day');
          $('#leave-day-type-select').attr('required', true);
          $('#leave-day-type-select option').attr('disabled', true);

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
    return (
        <div className="content-wrapper">
          <div className="content-header">

            <div className="content">

              {/*Leave Update Form */}
              <div className='card' style={{'width': '40vw', 'margin': 'auto'}}>
                <div className='card-header'>
                  <div className="h3">Leave Response</div>
                </div>
                <div className='card-body ' style={{'background-color': 'white', 'padding': '30px'}}>
                  <form onSubmit={this.onSubmit}>
                    <fieldset id='response-fieldset' disabled>
                      <div>
                        <div className="form-group">
                          <label className="float-left">
                            Employee Name
                          </label>
                          <select
                              className="form-control"
                              required
                              value = {this.state.employeeName}
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

                        <div className='row'>
                          <div className='col-md-6'>
                            <div className="form-group">
                              <label className="float-left">
                                Leave Type
                              </label>
                              <select
                                  type=""
                                  required
                                  className="form-control"
                                  value = {this.state.leaveTypeId}
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
                          </div>
                          <div className='col-md-6'>
                            <div className="form-group leave-day-type-div" style={{
                              display:'none'
                            }}>
                              <label className="float-left">
                                Leave Category
                              </label>
                              <select
                                  className="form-control"
                                  id="leave-day-type-select"
                                  value = {this.state.leaveDayType}
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
                          </div>
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
                              value = {this.state.leaveDayPart}
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
                              value = {this.state.supportiveEmployee}
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

                      <div className="form-group">
                        <label className="float-left">Reject Reason</label>
                        <textarea
                            className="form-control"
                            id=""
                            rows=""
                            disabled={this.state.status === 'Pending' ? '': 'disabled'}
                            value={this.state.reject_reason}
                            onChange={(e) =>
                                this.setState({ reject_reason: e.target.value })
                            }
                        ></textarea>
                      </div>

                      {
                        this.state.onAnError ?
                            <div className="alert alert-danger">
                              <strong>Oops!</strong> {this.state.onAnError}
                            </div> :
                            null
                      }

                    </fieldset>
                  </form>
                  <div className='button-set'>
                    {
                      this.state.status === 'Pending' ?
                          <div className="card-footer text-right">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.makeEditable}
                            >
                              <span id='response-edit-btn-text'>Edit</span>
                            </button>
                            &nbsp;
                            &nbsp;
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={this.deleteLeave}
                            >
                              <span id='response-edit-btn-text'>Delete</span>
                            </button>
                            &nbsp;
                            &nbsp;

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={this.rejected}
                            >
                              Reject
                            </button>
                            &nbsp;
                            &nbsp;
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={this.approved}
                            >
                              Accept
                            </button>
                          </div>
                          :
                          null

                    }
                  </div>
                </div>
              </div>


            </div>


          </div>
        </div>
    );
  }
}

export default LeaveResponse;
