import React, {Component, Fragment} from 'react';
import axios from  'axios';
import SimpleReactValidator from 'simple-react-validator';

class User extends Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            // user_logged: localStorage.getItem('userLogged'),
            user_name: '',
            email: '',
            employeeList: [],
            selected_employee: undefined,
            create_new: false,
            password: '',
            token:'',
            is_logged: this.props.is_logged,
            userList:[],
            selectedUser: '',
            id: '',
            first_name: ''
        }

        this.validator = new SimpleReactValidator();
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value,
        });

    }

    onClickEditHandler(user){
        this.setState({
            selectedUser:user
        });
        this.setState({
            id:user._id
        });
        this.setState({
            user_name:user.user_name
        })
        this.setState({
            email:user.email
        })
        this.setState({
            selected_employee: (user.employeeId? user.employeeId._id : null)
        })

        console.log(this.state.selectedUser)

    }

    componentDidMount() {
        this.getEmployee();
        this.getUser();
    }

    // handleValidation() {
    //     let fields = this.state.fields;
    //     let errors = {};
    //     let formIsValid = true;
    //
    //     if(!fields["user_name"]){
    //         formIsValid = false;
    //         errors["user_name"] = "Cannot be empty";
    //     }
    //     this.setState({errors: errors});
    //     return formIsValid;
    // }

    handleSubmit(event) {

        event.preventDefault();
        const object = {
            user_name: this.state.user_name,
            email: this.state.email,
            create_new: this.state.create_new,
            employeeId: this.state.selected_employee
        };


        if (this.state.id) {
            axios.post('http://localhost:9000/user/update' + `/${this.state.id}`, object)
                .then(res => {
                    console.log(res);
                    alert("Successfully Updated")
                    // ToastsStore.success('Successfully Updated!');

                    this.getUser();


                });
            //clear states
            this.setState({
                id: '',
                user_name: '',
                email: '',
                selected_employee: undefined,
                create_new: false,
                first_name: ''
            })
        }
        else {
            const obj={
                first_name: this.state.user_name,
                email : this.state.email
            }

            axios.post('http://localhost:9000/user/add', object)
                .then(res => {
                    console.log(res);
                    console.log("successfully added User");
                    axios.post('http://localhost:9000/employee/add', obj)
                        .then(res => {
                            console.log(res);
                            console.log("successfully added Employee");
                            this.getUser();
                        });
                });

        }
        //clear states
        this.setState({
            id: '',
            user_name: '',
            email: '',
            selected_employee: undefined,
            create_new: false,
            first_name: ''
        })

        if (this.validator.allValid()) {
            alert('You submitted the form and stuff!');
        } else {
            this.validator.showMessages();

        }
    }

    getEmployee() {
        fetch("http://localhost:9000/employee/", {

            method: "GET",
        })
            .then((data) => data.json())
            .then((data) => this.setState({employeeList: data}))
            .catch(error => {
                console.log('There was an error!');
            })
    }

    getUser() {
        fetch("http://localhost:9000/user/", {

            method: "GET",
        })
            .then((data) => data.json())
            .then((data) => this.setState({userList: data }, console.log(data)))
            .catch(error => {
                console.log('There was an error!');
            })
    }


    deleteRow = (id) => {
        axios.delete('http://localhost:9000/user/delete' + `/${id}`)
            .then(res => {
                this.getUser();
            });
    }



    render() {
        // if ((this.state.is_logged == undefined) || (!this.state.is_logged)) {
        //     return (
        //         window.location.href = "/"
        //     )
        // } else {
            const defineEmployeeList = () => {
                let isEmployee = false
                const mappedList = this.state.employeeList.map((employee) => {
                    if (this.state.selected_employee && employee._id == this.state.selected_employee) {
                        isEmployee = true
                        return <option key={employee._id} selected='selected'
                                       value={employee._id ? employee._id : null}> {employee.first_name}</option>

                    } else {
                        return <option key={employee._id}
                                       value={employee._id ? employee._id : null}> {employee.first_name}</option>

                    }
                })
                const list = isEmployee ?
                    <option id='employee_select_disabled' disabled='true'>Select employee</option> :
                    <option id='employee_select_disabled' value='' selected disabled='true'>Select employee</option>
                return [list, ...mappedList]
            }

            return (
                <Fragment>
                    <div className="content-wrapper">
                        <section className="content-header">
                            <h1>User</h1>
                            <ol className="breadcrumb">
                                <li>
                                    <a href="#">
                                        <i className="fa fa-users"></i> Home
                                    </a>
                                </li>
                                <li>
                                    <a href="#">User</a>
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
                                                data-target=".new-user"
                                            >
                                                Create New User
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
                                                    <th scope="col">User Name</th>
                                                    <th scope="col">Email</th>
                                                    {/*<th scope="col">Create New</th>*/}
                                                    <th scope="col">Employee</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.userList.map((user, index) => (
                                                    <tr key={user._id}>
                                                        <td scope="col">{user.user_name}</td>
                                                        <td scope="col">{user.email}</td>
                                                        {/*<td scope="col">{user.create_new}</td>*/}
                                                        <td scope="col">{user.employeeId ? user.employeeId.first_name : null}</td>

                                                        <td scope="col">
                                                            <a type="button" className="btn mr-4" data-toggle="modal"
                                                               onClick={() => this.onClickEditHandler(user)}
                                                               data-target="#editModal">
                                                                <i className="fa fa-edit"></i>
                                                            </a>
                                                            <a type="button"
                                                               onClick={(e) => this.deleteRow(user._id, e)}>
                                                                <i className="fa fa-trash"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))
                                                }
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="modal fade new-user" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Add New User</h4>
                                    </div>
                                    <form role="form">
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="user_name"
                                                    id="user_name"
                                                    placeholder="Name"
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                                {this.validator.message('user_name', this.state.user_name, 'required|alpha', {className: 'text-danger'})}
                                                {/*<span style={{color: "red"}}>{this.state.errors["user_name"]}</span>*/}
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    onChange={this.handleChange}
                                                    required
                                                    placeholder="Email"
                                                />
                                                {this.validator.message('email', this.state.email, 'required|email', {className: 'text-danger'})}
                                            </div>
                                            <div className="form-group">
                                                <label>Employee</label>
                                                <select
                                                    className="form-control"
                                                    onChange={this.handleChange}
                                                    name="selected_employee"
                                                >
                                                    <option
                                                        selected="selected"
                                                        disabled="disabled"
                                                    >
                                                        Select Employee
                                                    </option>
                                                    {this.state.employeeList.map((employee) => (
                                                        <option key={employee._id}
                                                                value={employee._id}>{employee.first_name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <div className="form-control">
                                                    <label>
                                                        <input type="checkbox" value={this.state.create_new}
                                                               onChange={this.handleChange}
                                                               name="create_new" value='true'/> Create New
                                                    </label>
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
                                            <button type="submit" className="btn btn-primary"
                                                    onClick={this.handleSubmit}>
                                                Create
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="editModal" tabIndex="-1" role="dialog"
                             aria-labelledby="exampleModalLabel"
                             aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Edit User</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="form-group">
                                                <label className="col-form-label">Name:</label>
                                                <input type="text" className="form-control" id="recipient-name"
                                                       name="user_name" onChange={this.handleChange}
                                                       defaultValue={this.state.selectedUser.user_name}/>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label">Email:</label>
                                                <input type="text" className="form-control" id="message-text"
                                                       name="email" onChange={this.handleChange}
                                                       defaultValue={this.state.selectedUser.email}/>
                                            </div>
                                            <div className="form-group">
                                                <label>Employee</label>
                                                <select
                                                    className="form-control"
                                                    onChange={this.handleChange}
                                                    name="selected_employee"
                                                >
                                                    {defineEmployeeList()}
                                                </select>
                                            </div>
                                        </form>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close
                                        </button>
                                        <button type="button" className="btn btn-primary"
                                                onClick={this.handleSubmit}>Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Fragment>
            )
        }
    // }

}

export default User;