import React, { Component } from "react";
import axios from "axios";
import { Route , withRouter} from 'react-router-dom';

class Reset extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state={
            id: localStorage.getItem('id'),
            // id: this.props.location.mystate,
            password: '',
            conform: '',
            current_password: '',
            isInitialLogin: true,
            is_logged: localStorage.getItem('userLogged'),
        }
    }

    // componentDidMount(props) {
    //     const {id} = this.props.location.mystate
    //     this.setState({
    //         id: id
    //     })
    // }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value,

        });
    }

    handleSubmit(event){
        event.preventDefault()
        console.log(this.state)
        console.log(this.state.id)
        const obj = {
            id: this.state.id,
            password: this.state.password,
            conform : this.state.conform,
            current_password: this.state.current_password

        }

        if (this.state.password == this.state.conform) {
            axios.put('http://localhost:9000/user/reset' + `/${this.state.id}`, obj)
                .then(res => {
                    if (res.data.status == 201){
                        // console.log("incorrect current password")
                        alert("Incorrect Password")
                        window.location.href = "/root"
                    }
                    if (res.data.status == 200){
                        alert("Reset Successfully")
                        window.location.href = "/"
                    }

                }).catch((error) => {
                    console.log(error.response)
                    alert("Unable to update password")
                })

            }else {
                alert("password does not match")

            }


            this.setState({
                id: '',
                password: '',
                conform: '',
                current_passsword: ''
            })

    }

    render() {
        if ((this.state.is_logged == undefined) || (!this.state.is_logged)) {
            return (
                window.location.href = "/"
            )
        } else {
            return (
                <div className="content-wrapper align-center">
                    <div className="container">
                        <form className="form-signin">
                            {/*<h2>id {this.state.id}</h2>*/}
                            <h2 className="form-signin-heading">Reset Password</h2>
                            <div className="form-group">
                                <label htmlFor="inputPassword" className="sr-only">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="inputCurrentPassword"
                                    className="form-control"
                                    placeholder="current Password"
                                    onChange={this.handleChange}
                                    name="current_password"
                                    required=""
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputPassword" className="sr-only">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="inputPassword"
                                    className="form-control"
                                    placeholder="New Password"
                                    onChange={this.handleChange}
                                    name="password"
                                    required=""
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputPassword" className="sr-only">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="conform"
                                    className="form-control"
                                    placeholder="Conform Password"
                                    onChange={this.handleChange}
                                    name="conform"
                                    required=""
                                />
                            </div>
                            <button className="btn btn-lg btn-primary btn-block" type="submit"
                                    onClick={this.handleSubmit}>
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            );
        }
    }
}

export default Reset;
