import React, { Component, Fragment } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import $ from "jquery";

class LeaveType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaveTypes: [],
      leaveType_code: "",
      leaveType: "",
      day_type: null,
      dayRange: null,
      needSupportive: null,
      needAllocation: null,
      yearRestriction: null,
    };
  }

  updateLeaveType = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    const leaveType = {
      leaveType: formData.get("leaveType"),
      leaveType_code: formData.get("leaveType_code"),
      day_type: formData.get("day_type_edited"),
      day_range: formData.get("day_range_edited"),
      need_supportive: formData.get("needSupportiveEdited"),
      need_allocation: formData.get("needAllocationEdited"),
      year_restriction: formData.get("yearRestrictionEdited"),
    };
    axios
        .post(
            "http://localhost:9000/leaveType/update/" +
            document.getElementById("leaveType_id_edited").value,
            leaveType
        )
        .then((res) => {
          console.log(res.data);
          window.location.href = "/leave_type";
        });

    this.props.history.push("/leave_type");
  };

  createLeaveType = (event) => {
    event.preventDefault();
    const leaveType = {
      leaveType: this.state.leaveType,
      leaveType_code: this.state.leaveType_code,
      day_type: this.state.day_type,
      day_range: this.state.dayRange,
      need_supportive: this.state.needSupportive,
      need_allocation: this.state.needAllocation,
      year_restriction: this.state.yearRestriction,
    };
    axios
        .post("http://localhost:9000/leaveType/add", leaveType)
        .then((response) => {
          window.location = "/leave_type";
        })
        .catch(function (error) {
          console.log(error);
        });
  };

  onChangeLeaveAllocation = () => {

    if(this.state.needAllocation === 'true'){
      $('.year-restriction-group').css("display", "block");

      $('#yearRestrictionYes').attr("required", true);
    }else{
      $('.year-restriction-group').css("display", "none");

      $('#yearRestrictionYes').attr("required", false);
      this.setState({yearRestriction: null})
    }
  }

  getLeaveType = (id) => {
    const obj = this.state.leaveTypes.find((leaveType) => {
      return leaveType._id === id;
    });
    if (obj) {
      document.getElementById("leaveType_edited").value = obj.leaveType;
      document.getElementById("code_edited").value = obj.leaveType_code;
      document.getElementById("leaveType_id_edited").value = obj._id;
      document.getElementById("day_type_edited").value = obj.day_type;
      document.getElementById("day_range_edited").value = obj.day_range;

      obj.need_supportive ? document.getElementById("needSupportiveYesEdited").checked = true : document.getElementById("needSupportiveNoEdited").checked = true
      obj.need_allocation ? document.getElementById("needAllocationYesEdited").checked = true : document.getElementById("needAllocationNoEdited").checked = true
      obj.year_restriction ? document.getElementById("yearRestrictionYesEdited").checked = true : document.getElementById("yearRestrictionNoEdited").checked = true

    }
  };

  getLeaveTypes = () => {
    // console.log(this.state.designations);
    return this.state.leaveTypes.map((leaveType) => {
      return (
          <tr>
            <td>{leaveType.leaveType}</td>
            <td>{leaveType.leaveType_code}</td>
            <td>{leaveType.day_type}</td>
            <td>{leaveType.day_range}</td>
            <td>{leaveType.need_supportive ? "Yes" : "No"}</td>
            <td>{leaveType.need_allocation ? "Yes" : "No"}</td>
            <td>{leaveType.leaveType_status ? "Active" : "Inactive"}</td>
            <td scope="col">
              <a type="button" className="btn mr-4">
                <i
                    className="fa fa-edit"
                    data-toggle="modal"
                    data-target=".update-leaveType"
                    onClick={() => this.getLeaveType(leaveType._id)}
                >
                  &nbsp; Update
                </i>
              </a>
              &nbsp;
              <a type="button" className="btn mr-4">
                <i
                    className="fa fa-trash"
                    onClick={() => this.deleteLeaveType(leaveType._id)}
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
                      this.changeStatus(leaveType._id, leaveType.leaveType_status)
                  }
              >
                {leaveType.leaveType_status ? "Inactive" : "Active"}
              </button>
            </td>
          </tr>
      );
    });
  };

  changeStatus = (id, currentStatus = false) => {
    const obj = {
      leaveType_status: !currentStatus,
    };
    axios
        .post("http://localhost:9000/leaveType/update/" + id, obj)
        .then((res) => {
          console.log(res.data);
          window.location.href = "/leave_type";
        });
  };

  componentDidMount() {
    axios
        .get("http://localhost:9000/leaveType")
        .then((response) => {
          this.setState({ leaveTypes: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  deleteLeaveType(id) {
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
            .delete("http://localhost:9000/leaveType/delete/" + id)
            .then((res) => {
              if (res.data.status) {
                Swal.fire({
                  title: 'YAY!!!',
                  text: 'Leave Type has been deleted successfully',
                  icon: 'success',
                  timer: 1500
                }).then(() => {
                  window.location.href = "/leave_type";
                })
              }else{
                return Swal.fire({
                  title: 'Oops!!!',
                  text: res.data.leaveType,
                  icon: 'error',
                })
              }
            })
            .catch((error) => {
              console.log(error);
              alert("Cannot delete this leave type..");
            });

      }
    })

  }

  render() {
    return (
        <Fragment>
          <div className="content-wrapper">
            <section className="content-header">
              <h1>Leave Types</h1>
              <ol className="breadcrumb">
                <li>
                  <a href="#">
                    <i className="fa fa-users"></i> Home
                  </a>
                </li>
                <li>
                  <a href="#">Leave Types</a>
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
                          id="create_type"
                          data-toggle="modal"
                          data-target=".new-type"
                      >
                        Create New Leave Type
                      </button>
                    </div>
                    <div className="box-body">
                      <div className="row">
                        <div className="col-md-12"></div>
                      </div>
                    </div>

                    <div className="content">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                        <tr>
                          <th scope="col">Leave Type</th>
                          <th scope="col">Code</th>
                          <th scope="col">Day Type</th>
                          <th scope="col">Day Range</th>
                          <th scope="col">Need Supportive Employee</th>
                          <th scope="col">Need Leave Allocations</th>
                          <th scope="col">Status</th>
                          <th scope="col" colSpan='2'>Action</th>
                        </tr>
                        </thead>
                        <tbody>{this.getLeaveTypes()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/*add new type modal*/}
            <div className="modal fade new-type" tabIndex="-1" role="dialog">
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add New Leave Type</h4>
                  </div>
                  <form role="form" onSubmit={this.createLeaveType}>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>Leave Type</label>
                        <input
                            type="text"
                            className="form-control"
                            name="leaveType_name"
                            placeholder="Leave Type"
                            required
                            onChange={(e) =>
                                this.setState({
                                  leaveType: e.target.value,
                                })
                            }
                        />
                      </div>
                      <div className="form-group">
                        <label>Code</label>
                        <input
                            type="text"
                            className="form-control"
                            name="leaveType_code"
                            placeholder="Code"
                            required
                            onChange={(e) =>
                                this.setState({
                                  leaveType_code: e.target.value,
                                })
                            }
                        />
                      </div>
                      <div className="form-group">
                        <label className="float-left">
                          Day Type
                        </label>
                        <select
                            className="form-control"
                            required
                            onChange={(e) =>
                                this.setState({
                                  day_type: e.target.value,
                                })
                            }
                        >
                          <option
                              selected
                              disabled
                              value=""
                          >
                            Select Day Type
                          </option>
                          <option value="Full day">Full Day</option>
                          <option value="Half day">Half Day</option>
                          <option value="Both">Both</option>
                          <option value="Time">Time Only</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="float-left">
                          Day Range
                        </label>
                        <select
                            className="form-control"
                            required
                            onChange={(e) =>
                                this.setState({
                                  dayRange: e.target.value,
                                })
                            }
                        >
                          <option
                              selected
                              disabled
                              value=""
                          >
                            Select Day Range
                          </option>
                          <option value="Single">Single Day</option>
                          <option value="Multiple">Multiple Days</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="float-left">
                          Need Supportive Employee
                        </label>
                        <br/>
                        <input type="radio" id="needSupportiveYes" name="needSupportive" value="true" required  onChange={(e) =>
                            this.setState({
                              needSupportive: e.target.value,
                            })
                        }/>
                        <label htmlFor="needSupportiveYes">Yes</label><br/>
                        <input type="radio" id="needSupportiveNo" name="needSupportive" value="false" onChange={(e) =>
                            this.setState({
                              needSupportive: e.target.value,
                            })
                        }/>
                        <label htmlFor="needSupportiveNo">No</label><br/>
                      </div>


                    <div className="form-group">
                      <label className="float-left">
                        Need Leave Allocation
                      </label>
                      <br/>
                      <input type="radio" id="needAllocationYes" name="needAllocation" value="true" required onChange={(e) =>
                          this.setState({
                            needAllocation: e.target.value,
                          })
                      }/>
                      <label htmlFor="needAllocationYes">Yes</label><br/>
                      <input type="radio" id="needAllocationNo" name="needAllocation" value="false" onChange={(e) =>
                          this.setState({
                            needAllocation: e.target.value,
                          })
                      }/>
                      <label htmlFor="needAllocationNo">No</label><br/>
                    </div>
                      {
                        this.state.needAllocation === 'true' ?
                            <div className="form-group " >
                              <label className="float-left">
                                Year Restriction
                              </label>
                              <br/>
                              <input type="radio" id="yearRestrictionYes" name="yearRestriction" value="true" required={this.state.needAllocation} onChange={(e) =>
                                  this.setState({
                                    yearRestriction: e.target.value,
                                  })
                              }/>
                              <label htmlFor="yearRestrictionYes">Yes</label><br/>
                              <input type="radio" id="yearRestrictionNo" name="yearRestriction" value="false" onChange={(e) =>
                                  this.setState({
                                    yearRestriction: e.target.value,
                                  })
                              }/>
                              <label htmlFor="yearRestrictionNo">No</label><br/>
                            </div> :
                            null
                      }


                </div>
                    <div className="modal-footer">
                      <buttona
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                      >
                        Reset
                      </buttona>
                      <button type="submit" className="btn btn-primary">
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/*update - leave type modal*/}

            <div
                className="modal fade update-leaveType"
                tabIndex="-1"
                role="dialog"
            >
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Update Leave Type</h4>
                  </div>
                  <form role="form" onSubmit={this.updateLeaveType}>
                    <div className="modal-body">
                      <input
                          type="hidden"
                          className="form-control"
                          name="designation_id"
                          id="leaveType_id_edited"
                          placeholder="Leave Type ID"
                          required
                      />
                      <div className="form-group">
                        <label>Leave Type</label>
                        <input
                            type="text"
                            className="form-control"
                            name="leaveType"
                            id="leaveType_edited"
                            placeholder="Leave Type"
                            required
                        />
                      </div>
                      <div className="form-group">
                        <label>Code</label>
                        <input
                            type="text"
                            id="code_edited"
                            className="form-control"
                            name="leaveType_code"
                            placeholder="Code"
                            required
                        />
                      </div>

                      <div className="form-group">
                        <label className="float-left">
                          Day Type
                        </label>
                        <select
                            className="form-control"
                            id='day_type_edited'
                            name='day_type_edited'
                            required
                            onChange={(e) =>
                                this.setState({
                                  day_type: e.target.value,
                                })
                            }
                        >
                          <option
                              selected
                              disabled
                              value=""
                          >
                            Select Day Type
                          </option>
                          <option value="Full day">Full Day</option>
                          <option value="Half day">Half Day</option>
                          <option value="Both">Both</option>
                          <option value="Time">Time Only</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="float-left">
                          Day Range
                        </label>
                        <select
                            className="form-control"
                            id='day_range_edited'
                            name='day_range_edited'
                            required
                            onChange={(e) =>
                                this.setState({
                                  dayRange: e.target.value,
                                })
                            }
                        >
                          <option
                              selected
                              disabled
                              value=""
                          >
                            Select Day Range
                          </option>
                          <option value="Single">Single Day</option>
                          <option value="Multiple">Multiple Days</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="float-left">
                          Need Supportive Employee
                        </label>
                        <br/>
                        <input type="radio" id="needSupportiveYesEdited" name="needSupportiveEdited" value="true" required  onChange={(e) =>
                            this.setState({
                              needSupportive: e.target.value,
                            })
                        }/>
                        <label htmlFor="needSupportiveYesEdited">Yes</label><br/>
                        <input type="radio" id="needSupportiveNoEdited" name="needSupportiveEdited" value="false" onChange={(e) =>
                            this.setState({
                              needSupportive: e.target.value,
                            })
                        }/>
                        <label htmlFor="needSupportiveNoEdited">No</label><br/>
                      </div>


                      <div className="form-group">
                        <label className="float-left">
                          Need Leave Allocation
                        </label>
                        <br/>
                        <input type="radio" id="needAllocationYesEdited" name="needAllocationEdited" value="true" required onChange={(e) =>
                            this.setState({
                              needAllocation: e.target.value,
                            })
                        }/>
                        <label htmlFor="needAllocationYesEdited">Yes</label><br/>
                        <input type="radio" id="needAllocationNoEdited" name="needAllocationEdited" value="false" onChange={(e) =>
                            this.setState({
                              needAllocation: e.target.value,
                            })
                        }/>
                        <label htmlFor="needAllocationNoEdited">No</label><br/>
                      </div>

                            <div className="form-group">
                              <label className="float-left">
                                Year Restriction
                              </label>
                              <br/>
                              <input type="radio" id="yearRestrictionYesEdited" name="yearRestrictionEdited" value="true" required={this.state.needAllocation} onChange={(e) =>
                                  this.setState({
                                    yearRestriction: e.target.value,
                                  })
                              }/>
                              <label htmlFor="yearRestrictionYesEdited">Yes</label><br/>
                              <input type="radio" id="yearRestrictionNoEdited" name="yearRestrictionEdited" value="false" onChange={(e) =>
                                  this.setState({
                                    yearRestriction: e.target.value,
                                  })
                              }/>
                              <label htmlFor="yearRestrictionNoEdited">No</label><br/>
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

export default LeaveType;
