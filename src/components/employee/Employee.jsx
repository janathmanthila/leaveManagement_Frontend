import React, { Component, Fragment } from "react";
import axios from "axios";

var supervisorsList = [];
var designationsList = [];

class Employee extends Component {
  constructor(props) {
    super(props);
    this.supervisorRef = React.createRef();
    this.state = {
      designation: "",
      employees: [],
      designations: [],
      supervisors: [],
      invalid: false,
      displayErrors: false,
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:9000/employee")
      .then((response) => {
        this.setState({ employees: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://localhost:9000/designation")
      .then((response) => {
        this.setState({ designations: response.data });
      })
      .catch((error) => console.log(error.response));
  }

  getEmployee = (id) => {
    const obj = this.state.employees.find((employee) => {
      return employee._id === id;
    });
    if (obj) {
      document.getElementById("employee_id_edited").value = obj._id;
      document.getElementById("first_name_edited").value = obj.first_name;
      document.getElementById("last_name_edited").value = obj.last_name;
      document.getElementById("email_edited").value = obj.email;
      document.getElementById("contact_edited").value = obj.contactNo;
      document.getElementById("birthday_edited").value = obj.birthday.slice(
        0,
        10
      );
      document.getElementById("designation_edited").value =
        obj.designationId._id;
      document.getElementById("supervisor_edited").value = obj.supervisorId;
      document.getElementById("manager_edited").value = obj.manager;
    }
  };

  getEmployees = () => {
    // console.log(employees);
    return this.state.employees.map((employee) => {
      console.log(employee);
      return (
        <tr>
          <td>{employee.first_name + " " + employee.last_name}</td>
          <td>{employee.email}</td>
          <td>{employee.contactNo}</td>
          <td>{employee.birthday.slice(0, 10)}</td>
          <td>
            {employee.designationId ? employee.designationId.designation : null}
          </td>
          <td scope="col">
            <a type="button" className="btn mr-4">
              <i
                className="fa fa-edit"
                data-toggle="modal"
                data-target=".update-employee"
                onClick={() => this.getEmployee(employee._id)}
              >
                &nbsp; Update
              </i>
            </a>
            &nbsp;
            <a type="button" className="btn mr-4">
              <i
                className="fa fa-trash"
                onClick={() => this.deleteEmployee(employee._id)}
              >
                &nbsp; Delete
              </i>
            </a>
          </td>
        </tr>
      );
    });
  };

  createEmployee = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    const employee = {
      first_name: formData.get("first-name"),
      last_name: formData.get("last-name"),
      email: formData.get("email"),
      contactNo: formData.get("contact"),
      manager: formData.get("manager"),
      birthday: formData.get("birthday"),
      designationId: formData.get("designation"),
      supervisorId: formData.get("supervisor"),
    };
    axios
      .post("http://localhost:9000/employee/add", employee)
      .then((response) => {
        // console.log("Success");
        window.location = "/employee";
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  updateEmployee = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    const employee = {
      first_name: formData.get("first-name"),
      last_name: formData.get("last-name"),
      email: formData.get("email"),
      contactNo: formData.get("contact"),
      manager: formData.get("manager"),
      birthday: formData.get("birthday"),
      designationId: formData.get("designation"),
      supervisorId: formData.get("supervisor"),
    };
    axios
      .post(
        "http://localhost:9000/employee/update/" +
          document.getElementById("employee_id_edited").value,
        employee
      )
      .then((res) => {
        console.log(res.data);
        window.location.href = "/employee";
      });

    this.props.history.push("/employee");
  };

  deleteEmployee(id) {
    axios
      .delete("http://localhost:9000/employee/delete/" + id)
      .then((res) => {
        console.log("designation successfully deleted!");
        window.location.href = "/employee";
      })
      .catch((error) => {
        console.log(error);
        alert(
          "Cannot delete this employee, this employee has a calendar event."
        );
      });
  }

  render() {
    return (
      <Fragment>
        <div className="content-wrapper">
          <section className="content-header">
            <h1>Employees</h1>
            <ol className="breadcrumb">
              <li>
                <a href="#">
                  <i className="fa fa-users"></i> Home
                </a>
              </li>
              <li>
                <a href="#">Employees</a>
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
                      data-target=".new-employee"
                    >
                      Create New Employee
                    </button>
                  </div>
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <table className="table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Contact No</th>
                              <th>Birthday</th>
                              <th>Designation</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>{this.getEmployees()}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/*add new employee modal*/}
          <div className="modal fade new-employee" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add New Employee</h4>
                </div>
                <form role="form" onSubmit={this.createEmployee}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="first-name"
                            placeholder="First Name"
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="last-name"
                            placeholder="Last Name"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Contact Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Contact Number"
                            name="contact"
                            required
                            pattern="\d+"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Birth Day</label>
                          <input
                            type="date"
                            className="form-control"
                            name="birthday"
                            id="datepicker"
                            placeholder="Birth Day"
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Designation</label>
                          <select name="designation" className="form-control">
                            <option selected="selected" disabled="disabled">
                              Select Designation
                            </option>

                            {this.state.designations.map((des) => (
                              <option key={des._id} value={des._id}>
                                {des.designation}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Supervisor</label>
                          <select name="supervisor" className="form-control">
                            <option selected="selected" disabled="disabled">
                              Select Supervisor
                            </option>

                            {this.state.employees.map((emp) => (
                              <option key={emp._id} value={emp._id}>
                                {emp.first_name + " " + emp.last_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group col-md-6">
                          <label>Manager</label>
                          <select
                            className="form-control"
                            name="manager"
                            required
                          >
                            <option value={1}>Yes</option>
                            <option value={0} selected>
                              No
                            </option>
                          </select>
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
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/*update employee modal*/}
          <div
            className="modal fade update-employee"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Update Employee</h4>
                </div>
                <form role="form" onSubmit={this.updateEmployee}>
                  <div className="modal-body">
                    <input
                      type="hidden"
                      className="form-control"
                      name="designation_id"
                      id="employee_id_edited"
                      placeholder="Employee ID"
                      required
                    />
                    <div className="row">
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="first-name"
                            id="first_name_edited"
                            placeholder="First Name"
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="last-name"
                            id="last_name_edited"
                            placeholder="Last Name"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email_edited"
                            placeholder="Email"
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Contact Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Contact Number"
                            name="contact"
                            id="contact_edited"
                            required
                            pattern="\d+"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Birth Day</label>
                          <input
                            type="date"
                            className="form-control"
                            name="birthday"
                            id="birthday_edited"
                            placeholder="Birth Day"
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Designation</label>
                          <select
                            name="designation"
                            id="designation_edited"
                            className="form-control"
                          >
                            <option selected="selected" disabled="disabled">
                              Select Designation
                            </option>

                            {this.state.designations.map((des) => (
                              <option key={des._id} value={des._id}>
                                {des.designation}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Supervisor</label>
                          <select
                            name="supervisor"
                            id="supervisor_edited"
                            className="form-control"
                          >
                            <option selected="selected" disabled="disabled">
                              Select Supervisor
                            </option>

                            {this.state.employees.map((emp) => (
                              <option key={emp._id} value={emp._id}>
                                {emp.first_name + " " + emp.last_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group col-md-6">
                          <label>Manager</label>
                          <select
                            className="form-control"
                            name="manager"
                            id="manager_edited"
                            required
                          >
                            <option value={1}>Yes</option>
                            <option value={0} selected>
                              No
                            </option>
                          </select>
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

export default Employee;
