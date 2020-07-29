import React, { Component, Fragment } from "react";
import axios from "axios";

class LeaveType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaveTypes: [],
      leaveType_code: "",
      leaveType: "",
    };
  }

  updateLeaveType = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    const designation = {
      leaveType: formData.get("leaveType"),
      leaveType_code: formData.get("leaveType_code"),
    };
    axios
      .post(
        "http://localhost:9000/leaveType/update/" +
          document.getElementById("leaveType_id_edited").value,
        designation
      )
      .then((res) => {
        console.log(res.data);
        window.location.href = "/leave_type";
      });

    this.props.history.push("/leave_type");
  };

  createLeaveType = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    const leaveType = {
      leaveType: formData.get("leaveType_name"),
      leaveType_code: formData.get("leaveType_code"),
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

  getLeaveType = (id) => {
    const obj = this.state.leaveTypes.find((leaveType) => {
      return leaveType._id === id;
    });
    if (obj) {
      document.getElementById("leaveType_edited").value = obj.leaveType;
      document.getElementById("code_edited").value = obj.leaveType_code;
      document.getElementById("leaveType_id_edited").value = obj._id;
    }
  };

  getLeaveTypes = () => {
    // console.log(this.state.designations);
    return this.state.leaveTypes.map((leaveType) => {
      return (
        <tr>
          <td>{leaveType.leaveType}</td>
          <td>{leaveType.leaveType_code}</td>
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
    axios
      .delete("http://localhost:9000/leaveType/delete/" + id)
      .then((res) => {
        console.log("Leave Type successfully deleted!");
        window.location.href = "/leave_type";
      })
      .catch((error) => {
        console.log(error);
        alert("Cannot delete this leave type..");
      });
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
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
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
                      />
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
