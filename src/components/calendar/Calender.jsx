import React, { Component, Fragment } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "popper.js/dist/popper";
import "bootstrap";
import { Modal } from "react-bootstrap";
import axios from "axios";

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
      employeeName: "",
      employeeList: [],
      leaveTypeId: null,
      leaveTypes: [],
      leaveAmount: "",
      startDate: "",
      endDate: "",
      reason: "",
      supervisor: "",
      status: "Pending",
      color: colors["Pending"],
      supervisorEmail: "",
      supportiveEmployee: "",
      onAnError: null,

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

  onSubmit(event) {
    event.preventDefault();
    const obj = {
      employeeId: this.state.employeeName,
      leaveTypeId: this.state.leaveTypeId,
      leaveAmount: this.state.leaveAmount,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      reason: this.state.reason,
      supervisor: this.state.supervisor,
      status: this.state.status,
      color: this.state.color,
      email: this.state.email,
      supervisorEmail: this.state.supervisorEmail,
      supportiveEmployeeId: this.state.supportiveEmployee,
    };
    console.log(obj);
    axios
      .post("http://localhost:9000/calendarEvent/add", obj)
      .then((res) => {
        console.log(res.data);
        return res
        // window.location.href = '/calender'
      })
      .then((res) => {
        if(res.data.status){
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
                this.setState({ events: eventList });
                window.location.href = "/";
              })
              .catch((error) => {
                console.log(error.response)
              });

          this.setState({
            employeeName: "",
            leaveTypeId: null,
            leaveAmount: "",
            startDate: "",
            endDate: "",
            reason: "",
            supervisor: "",
            status: "Pending",
            color: colors["Pending"],
            email: "",
            supervisorEmail: "",
            supportiveEmployee: "",
          });

        }else{
          this.setState({ onAnError:res.data.calendarEvent })
        }

      });


  }

  componentDidMount() {
    //calendar events hit to the full calendar
    axios
      .get("http://localhost:9000/CalendarEvent")
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
            url:
              data.status === "Pending"
                ? "http://localhost:3000/leaves/edit/" + data._id
                : "",
            color: data.color,
          };
        });
        console.log(eventList);
        this.setState({ events: eventList });
      })
      .catch((error) => console.log(error.response));

    axios
      .get("http://localhost:9000/employee")
      .then((response) => {
        this.setState({ employeeList: response.data });
      })
      .catch((error) => console.log(error.response));

    axios
      .get("http://localhost:9000/leaveType")
      .then((response) => {
        this.setState({ leaveTypes: response.data });
      })
      .catch((error) => console.log(error.response));
  }

  changeEmployee = (e) => {
    this.setState({
      employeeName: e.target.value,
      email: this.employeeRef.current.id,
      supervisor: document
        .getElementById(this.employeeRef.current.id)
        .getAttribute("data-managerName"),
      supervisorEmail: document
        .getElementById(this.employeeRef.current.id)
        .getAttribute("data-manager"),
    });
  };

  select = (e) => {
    this.setState({ show: true, startDate: e.startStr, endDate: e.endStr });
  };

  render() {
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
                                      onChange={(e) =>
                                        this.setState({
                                          employeeName: e.target.value,
                                        })
                                      }
                                    >
                                      <option
                                        selected="selected"
                                        disabled="disabled"
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
                                      className="form-control"
                                      onChange={(e) =>
                                        this.setState({
                                          leaveTypeId: e.target.value,
                                        })
                                      }
                                    >
                                      <option
                                        selected="selected"
                                        disabled="disabled"
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

                                  <div className="form-group">
                                    <label className="float-left">
                                      Leave Category
                                    </label>
                                    <select
                                      className="form-control"
                                      // value={
                                      //   this.state.leaveAmount
                                      //     ? this.state.leaveAmount
                                      //     : "selected"
                                      // }
                                      onChange={(e) =>
                                        this.setState({
                                          leaveAmount: e.target.value,
                                        })
                                      }
                                    >
                                      <option
                                          selected
                                          disabled
                                          value=""
                                      >
                                        Select leave category
                                      </option>
                                      <option value="1">Full Day</option>
                                      <option value="0.5">Half Day</option>
                                    </select>
                                  </div>

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
                                          })
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
                                          })
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="float-left">
                                      Supportive Employee
                                    </label>
                                    <select
                                      className="form-control"
                                      onChange={(e) =>
                                        this.setState({
                                          supportiveEmployee: e.target.value,
                                        })
                                      }
                                    >
                                      <option
                                        selected="selected"
                                        disabled="disabled"
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
                                      value={this.state.reason}
                                      onChange={(e) =>
                                        this.setState({
                                          reason: e.target.value,
                                        })
                                      }
                                    ></textarea>
                                  </div>
                                </div>
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

export default Calender;
