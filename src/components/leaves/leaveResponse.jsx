import React, { Component } from "react";
import axios from "axios";
// import {formatDate, formatLongDate} from "react-calendar/dist/umd/shared/dateFormatter";
// import Moment from 'react-moment';

class LeaveResponse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeName: "",
      leaveType: "",
      leaveCategory: "",
      startDate: "",
      endDate: "",
      reason: "",
      manager: "",
      managerList: [],
      reject_reason: "",
      email: "",
    };
  }

  componentDidMount() {
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
          leaveType: response.data.leaveType,
          leaveCategory: response.data.leaveCategory,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          supportiveEmployee:
            response.data.supportiveEmployeeId.first_name +
            " " +
            response.data.supportiveEmployeeId.last_name,
          reason: response.data.reason,
          id: response.data._id,
          email: response.data.email,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://localhost:9000/employee")
      .then((response) => {
        this.setState({ managerList: response.data });
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

  render() {
    return (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="">Leave Response</div>
          <div className="content">
            <fieldset disabled>
              <form className="mt-4">
                <div className="form-group">
                  <label className="float-left">Employee Name</label>
                  <input
                    type=""
                    className="form-control"
                    value={this.state.employeeName}
                    onChange={(e) =>
                      this.setState({ employeeName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="float-left">Leave Type</label>
                  <select
                    className="form-control"
                    value={this.state.leaveType}
                    onChange={(e) =>
                      this.setState({ leaveType: e.target.value })
                    }
                  >
                    <option>Casual</option>
                    <option>Annual Leave</option>
                    <option>Maternity Leave</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="float-left">Leave Category</label>
                  <select
                    className="form-control"
                    value={this.state.leaveCategory}
                    onChange={(e) =>
                      this.setState({ leaveCategory: e.target.value })
                    }
                  >
                    <option>Full Day</option>
                    <option>Half Day</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="float-left">Start Date</label>

                  <input
                    type=""
                    className="form-control"
                    aria-describedby=""
                    value={this.state.startDate}
                    onChange={(e) =>
                      this.setState({ startDate: e.target.value })
                    }
                  />

                  <label className="float-left">End Date</label>
                  <input
                    type=""
                    className="form-control"
                    id=""
                    aria-describedby=""
                    placeholder="End Date"
                    value={this.state.endDate}
                    onChange={(e) => this.setState({ endDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="float-left">Supportive Employee</label>
                  <input
                    className="form-control"
                    value={this.state.supportiveEmployee}
                    onChange={(e) =>
                      this.setState({ supportiveEmployee: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="float-left">Reason</label>
                  <textarea
                    className="form-control"
                    id=""
                    rows=""
                    value={this.state.reason}
                    onChange={(e) => this.setState({ reason: e.target.value })}
                  ></textarea>
                </div>
              </form>
            </fieldset>
            <div className="form-group">
              <label className="float-left">Reject Reason</label>
              <textarea
                className="form-control"
                id=""
                rows=""
                value={this.state.reject_reason}
                onChange={(e) =>
                  this.setState({ reject_reason: e.target.value })
                }
              ></textarea>
            </div>
          </div>
          <div className="card-footer text-right">
            <button
              type="button"
              className="btn btn-danger"
              onClick={this.rejected}
            >
              Reject
            </button>{" "}
            &nbsp;
            <button
              type="button"
              className="btn btn-success"
              onClick={this.approved}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LeaveResponse;
