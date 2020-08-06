import React, { Component, Fragment } from "react";
import "react-dual-listbox/lib/react-dual-listbox.css";
import axios from "axios";

import AllocationLine from "../allocation-lines/allocation-lines.component";
import Swal from "sweetalert2";

class LeaveAllocation extends Component {
  constructor(props) {
    super(props);
    const year = new Date().getFullYear();
    this.years = Array.from(new Array(5), (val, index) => index + year);

    this.state = {
      employeeName: "",
      employeeList: [],
      leaveAllocate: [],
      leaveType: "",
      leaveTypes: [],
      year: "",
      allocationLines: [],
    };
  }

  componentDidMount() {
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

    axios
      .get("http://localhost:9000/leaveAllocate")
      .then((response) => {
        this.setState({ leaveAllocate: response.data });
      })
      .catch((error) => console.log(error.response));
  }

  getLeaveAllocate = (id) => {
    const obj = this.state.leaveAllocate.find((leaveAllocation) => {
      return leaveAllocation._id === id;
    });
    if (obj) {
      document.getElementById("leaveAllocate_id_edited").value = obj._id;
      document.getElementById("employee_edited").value = obj.employeeId._id;
      document.getElementById("leaveType_edited").value = obj.leaveTypeId._id;
      document.getElementById("num_of_leaves_edited").value = obj.leaveAmount;
      document.getElementById("year_edited").value = obj.year;
    }
  };

  add_allocation_line = () => {
    const { allocationLines } = this.state;
    if (allocationLines.length > 0) {
      const lastAllocatedLineID =
        allocationLines[allocationLines.length - 1].id;
      this.setState({
        allocationLines: [
          ...allocationLines,
          {
            id: lastAllocatedLineID + 1,
            leaveTypeId: null,
            leaveAmount: null,
            leaveAllocate_status: true,
          },
        ],
      });
    } else {
      this.setState({
        allocationLines: [
          {
            id: 1,
            leaveTypeId: null,
            leaveAmount: null,
            leaveAllocate_status: true,
          },
        ],
      });
    }
  };

  handleDeleteClick = (id) => {
    console.log(id);
    const newAllocationList = this.state.allocationLines.filter(
      (line) => line.id !== id
    );

    this.setState({ allocationLines: newAllocationList });
  };

  handleLineChange = (id, event) => {
    console.log(id);

    const allocationLineList = this.state.allocationLines.map((line) => {
      if (line.id === id) {
        return {
          ...line,
          [event.target.name]: event.target.value,
        };
      } else {
        return line;
      }
    });
    this.setState({ allocationLines: allocationLineList });
  };

  getLeavesAllocation = () => {
    return this.state.leaveAllocate.map((leaveAllocation) => {
      console.log(leaveAllocation);
      return (
        <tr>
          <td>
            {leaveAllocation.employeeId.first_name +
              " " +
              leaveAllocation.employeeId.last_name}
          </td>
          <td>{leaveAllocation.leaveTypeId.leaveType}</td>
          <td>{leaveAllocation.leaveAmount}</td>
          <td>{leaveAllocation.year}</td>
          <td>
            {leaveAllocation.leaveAllocate_status ? "Active" : "Inactive"}
          </td>
          <td scope="col">
            <a type="button" className="btn mr-4">
              <i
                className="fa fa-edit"
                data-toggle="modal"
                data-target=".update-leaveAllocation"
                onClick={() => this.getLeaveAllocate(leaveAllocation._id)}
              >
                &nbsp; Update
              </i>
            </a>
            &nbsp;
            <a type="button" className="btn mr-4">
              <i
                className="fa fa-trash"
                onClick={() => this.deleteLeaveAllocate(leaveAllocation._id)}
              >
                &nbsp; Delete
              </i>
            </a>
          </td>
          <td>
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={() =>
                this.changeStatus(
                  leaveAllocation._id,
                  leaveAllocation.leaveAllocate_status
                )
              }
            >
              {leaveAllocation.leaveAllocate_status ? "Inactive" : "Active"}
            </button>
          </td>
        </tr>
      );
    });
  };

  changeStatus = (id, currentStatus = false) => {
    const obj = {
      leaveAllocate_status: !currentStatus,
    };
    axios
      .post("http://localhost:9000/LeaveAllocate/update/" + id, obj)
      .then((res) => {
        console.log(res.data);
        window.location.href = "/leave_allocation";
      });
  };

  checkYearRestriction = (leaveTypeId, year, employeeId) => {
    const leaveType = this.state.leaveTypes.find(type => type._id === leaveTypeId)
    if(leaveType.year_restriction){
      return this.state.leaveAllocate.find(line => line.employeeId._id === employeeId && line.year === parseInt(year) && line.leaveTypeId._id === leaveTypeId) ? [true, leaveType] : [false, leaveType]
    }
    return [false, leaveType]
  }

  allocateLeave = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    // check for year restriction on leave type
    let errorData = [false, null]
    this.state.allocationLines.map(line => {
      let [restricted, leaveType] = this.checkYearRestriction(line.leaveTypeId, formData.get("year"), formData.get("employeeName"))
      if(restricted){
        errorData = [true, leaveType.leaveType]
      }
    })
    if(errorData[0]){
      return  Swal.fire({
        title: 'Oops!!!',
        text: 'There is a year restriction on ' + errorData[1],
        icon: 'error',
      })
    }
    const allocationData = {
      employeeId: formData.get("employeeName"),
      year: formData.get("year"),
      lines: this.state.allocationLines,
    };

    axios
      .post("http://localhost:9000/leaveAllocate/add", allocationData)
      .then((response) => {
        window.location = "/leave_allocation";
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  updateLeaveAllocation = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    const leaveAllocation = {
      leaveAmount: formData.get("update-num_of_leaves"),
      employeeId: formData.get("update-employeeName"),
      leaveTypeId: formData.get("update-leaveTypeId"),
      year: formData.get("update-year"),
    };
    axios
      .post(
        "http://localhost:9000/LeaveAllocate/update/" +
          document.getElementById("leaveAllocate_id_edited").value,
        leaveAllocation
      )
      .then((res) => {
        // console.log(res.data);
        window.location.href = "/leave_allocation";
      });

    this.props.history.push("/leave_allocation");
  };

  deleteLeaveAllocate(id) {
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
            .delete("http://localhost:9000/leaveAllocate/delete/" + id)
            .then((res) => {
              Swal.fire({
                title: 'YAY!!!',
                text: 'Allocation has been deleted successfully',
                icon: 'success',
                timer: 1500
              }).then(() => {
                window.location.href = "/leave_allocation";
              })
            })
            .catch((error) => {
              console.log(error);
            });
      }
    })

  }

  render() {
    return (
      <Fragment>
        <div className="content-wrapper">
          <section className="content-header">
            <h1>Leave Allocations</h1>
            <ol className="breadcrumb">
              <li>
                <a href="#">
                  <i className="fa fa-users"></i> Home
                </a>
              </li>
              <li>
                <a href="#">Leave Allocations</a>
              </li>
            </ol>
          </section>
          <section className="content">
            <div className="row">
              <div className="col-xs-12">
                <div className="box">
                  <div className="box-header">
                    <button
                      className="pull-right btn btn-success"
                      id="create_user"
                      data-toggle="modal"
                      data-target=".leave-allocate"
                    >
                      Leave Allocation
                    </button>
                  </div>
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <table className="table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">Employee</th>
                              <th scope="col">Leave Type</th>
                              <th scope="col">Number of Leaves</th>
                              <th scope="col">Year</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>{this.getLeavesAllocation()}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/*Leave allocation modal*/}
          <div
            className="modal fade leave-allocate"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Leave Allocate</h4>
                </div>
                <form role="form" onSubmit={this.allocateLeave}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Employee</label>
                        <select
                          type=""
                          className="form-control"
                          name="employeeName"
                          onChange={(e) =>
                            this.setState({
                              employeeName: e.target.value,
                            })
                          }
                        >
                          <option selected="selected" disabled="disabled">
                            Select employee
                          </option>

                          {this.state.employeeList.map((employee) => (
                            <option key={employee._id} value={employee._id}>
                              {employee.first_name + " " + employee.last_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6">
                        <label>Year</label>
                        <select
                          className="form-control"
                          name="year"
                          onChange={(e) =>
                            this.setState({
                              year: e.target.value,
                            })
                          }
                        >
                          <option selected="selected" disabled="disabled">
                            Select Year
                          </option>
                          {this.years.map((year, index) => {
                            return (
                              <option key={`year${index}`} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group">
                        {/*  Allocation Lines */}
                        <button
                          type="button"
                          onClick={this.add_allocation_line}
                        >
                          Add Allocation Line
                        </button>

                        <div id="allocation_lines_container" className="mb-2">
                          {this.state.allocationLines.map((line) => (
                            <AllocationLine
                              {...line}
                              key={line.id}
                              leaveTypes={this.state.leaveTypes}
                              handleDeleteClick={() =>
                                this.handleDeleteClick(line.id)
                              }
                              handleLineChange={(e) =>
                                this.handleLineChange(line.id, e)
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Reset
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Allocate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/*update leave allocation modal*/}
          <div
            className="modal fade update-leaveAllocation"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Update Leave Allocate</h4>
                </div>
                <form role="form" onSubmit={this.updateLeaveAllocation}>
                  <div className="modal-body">
                    <input
                      type="hidden"
                      className="form-control"
                      name="designation_id"
                      id="leaveAllocate_id_edited"
                      placeholder="Employee ID"
                      required
                    />
                    <div className="row">
                      <div className="form-row">
                        <div className="form-group col-md-3">
                          <label>Employee</label>
                          <select
                            className="form-control"
                            id="employee_edited"
                            name="update-employeeName"
                          >
                            <option selected="selected" disabled="disabled">
                              Select Employee
                            </option>

                            {this.state.employeeList.map((emp) => (
                              <option key={emp._id} value={emp._id}>
                                {emp.first_name + " " + emp.last_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group col-md-3">
                          <label>Year</label>

                          <select
                            className="form-control"
                            id="year_edited"
                            name="update-year"
                          >
                            <option selected="selected" disabled="disabled">
                              Select Year
                            </option>
                            {this.years.map((year, index) => {
                              return (
                                <option key={`year${index}`} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="form-group col-md-3">
                          <label>Leave Type</label>
                          <select
                            className="form-control"
                            id="leaveType_edited"
                            name="update-leaveTypeId"
                            required="required"
                          >
                            <option
                              selected="selected"
                              disabled="disabled"
                              value=""
                            >
                              Select Leave Type
                            </option>

                            {this.state.leaveTypes.map((leaveType) => (
                              <option key={leaveType._id} value={leaveType._id}>
                                {leaveType.leaveType}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group col-md-3">
                          <label>Number of Leaves</label>
                          <input
                            type="number"
                            className="form-control"
                            name="update-num_of_leaves"
                            id="num_of_leaves_edited"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Reset
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default LeaveAllocation;
