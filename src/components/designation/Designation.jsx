import React, { Component, Fragment } from "react";
import axios from "axios";
import Swal from "sweetalert2";

class Designation extends Component {
  constructor(props) {
    super(props);
    this.deleteDesignation = this.deleteDesignation.bind(this);
    this.supervisorRef = React.createRef();
    this.state = {
      token:'',
      is_logged: this.props.is_logged,
      designations: [],
      designation_code: "",
      designation: "",
    };
  }

  createDesignation = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    if(this.state.designations.filter(designation => designation.designation_code === formData.get("designation_code")).length > 1){
      return Swal.fire({
        title: 'Oops!!!',
        text: 'Designation code already exists',
        icon: 'error',
      })
    }
    const designation = {
      designation: formData.get("designation"),
      designation_code: formData.get("designation_code"),
      designation_status: true,
    };
    axios
      .post("http://localhost:9000/designation/add", designation)
      .then((response) => {
        window.location = "/designation";
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  updateDesignation = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    const designation = {
      designation: formData.get("designation"),
      designation_code: formData.get("designation_code"),
    };
    axios
      .post(
        "http://localhost:9000/designation/update/" +
          document.getElementById("designation_id_edited").value,
        designation
      )
      .then((res) => {
        console.log(res.data);
        window.location.href = "/designation";
      });

    this.props.history.push("/designation");
  };

  getDesignation = (id) => {
    const obj = this.state.designations.find((designation) => {
      return designation._id === id;
    });
    if (obj) {
      document.getElementById("designation_edited").value = obj.designation;
      document.getElementById("code_edited").value = obj.designation_code;
      document.getElementById("designation_id_edited").value = obj._id;
    }
  };

  componentDidMount() {
    axios
      .get("http://localhost:9000/designation")
      .then((response) => {
        this.setState({ designations: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  changeStatus = (id, currentStatus = false) => {
    const obj = {
      designation_status: !currentStatus,
    };
    axios
      .post("http://localhost:9000/designation/update/" + id, obj)
      .then((res) => {
        console.log(res.data);
        window.location.href = "/designation";
      });
  };

  deleteDesignation(id) {
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
            .delete("http://localhost:9000/designation/delete/" + id)
            .then((res) => {
              Swal.fire({
                title: 'YAY!!!',
                text: 'Designation has been deleted successfully',
                icon: 'success',
                timer: 1000
              }).then(() => {
                window.location.href = "/designation";
              })
            })
            .catch((error) => {
              console.log(error);
              return Swal.fire({
                title: 'Oops!!!',
                text: 'Cannot delete this designation, this designation has records from employees..',
                icon: 'error',
              })
            });
      }
    })

  }

  getDesignations = () => {
    // console.log(this.state.designations);
    return this.state.designations.map((designation) => {
      return (
        <tr>
          <td>{designation.designation}</td>
          <td>{designation.designation_code}</td>
          <td>{designation.designation_status ? "Active" : "Inactive"}</td>
          <td scope="col">
            <a type="button" className="btn mr-4">
              <i
                className="fa fa-edit"
                data-toggle="modal"
                data-target=".update-designation"
                onClick={() => this.getDesignation(designation._id)}
              >
                &nbsp; Update
              </i>
            </a>
            &nbsp;
            <a type="button" className="btn mr-4">
              <i
                className="fa fa-trash"
                onClick={() => this.deleteDesignation(designation._id)}
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
                  designation._id,
                  designation.designation_status
                )
              }
            >
              {designation.designation_status ? "Inactive" : "Active"}
            </button>
          </td>
        </tr>
      );
    });
  };

  render() {
    if ((this.props.is_logged == undefined) || (!this.props.is_logged)) {
      return (
          window.location.href = "/"
      )
    } else {
      return (
          <Fragment>
            <div className="content-wrapper">
              <section className="content-header">
                <h1>Designation</h1>
                <ol className="breadcrumb">
                  <li>
                    <a href="#">
                      <i className="fa fa-users"></i> Home
                    </a>
                  </li>
                  <li>
                    <a href="#">Designation</a>
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
                            id="create_designation"
                            data-toggle="modal"
                            data-target=".new-designation"
                        >
                          Create New Designation
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
                            <th scope="col">Designation</th>
                            <th scope="col">Code</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>
                          </thead>
                          <tbody>{this.getDesignations()}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/*add new designation modal*/}
              <div
                  className="modal fade new-designation"
                  tabIndex="-1"
                  role="dialog"
              >
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Add New Designation</h4>
                    </div>
                    <form role="form" onSubmit={this.createDesignation}>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>Designation</label>
                          <input
                              type="text"
                              className="form-control"
                              name="designation"
                              placeholder="Designation"
                              required
                          />
                        </div>
                        <div className="form-group">
                          <label>Code</label>
                          <input
                              type="text"
                              className="form-control"
                              name="designation_code"
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

              {/*update - designation modal*/}

              <div
                  className="modal fade update-designation"
                  tabIndex="-1"
                  role="dialog"
              >
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Update Designation</h4>
                    </div>
                    <form role="form" onSubmit={this.updateDesignation}>
                      <div className="modal-body">
                        <input
                            type="hidden"
                            className="form-control"
                            name="designation_id"
                            id="designation_id_edited"
                            placeholder="Designation ID"
                            required
                        />
                        <div className="form-group">
                          <label>Designation</label>
                          <input
                              type="text"
                              className="form-control"
                              name="designation"
                              id="designation_edited"
                              placeholder="Designation"
                              required
                          />
                        </div>
                        <div className="form-group">
                          <label>Code</label>
                          <input
                              type="text"
                              id="code_edited"
                              className="form-control"
                              name="designation_code"
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
}
export default Designation;
