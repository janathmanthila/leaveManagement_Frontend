import React, { Component } from "react";
import axios from "axios";
import { Route , withRouter} from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state={
      id: '',
      email: '',
      password: '',
      isInitialLogin: false,
      token:'',
      user_logged: '',
      name: ''
    }
  }

  handleChange=(event)=>{
    this.setState({
      [event.target.name]: event.target.value,

    });

  }

  handleSubmit(event){
    event.preventDefault()
    const obj = {
      email: this.state.email,
      password: this.state.password
    }
    if(this.state.email=="" || this.state.password==""){
      alert("Please Insert Email and password!")
    }else {
      axios.post('http://localhost:9000/user/login', obj)
          .then(res => {
            localStorage.setItem('userLogged', true);
            localStorage.setItem('name', res.data.user_name);
            localStorage.setItem('id', res.data.user_id);

            console.log(res);
            this.state.user_logged = localStorage.getItem('userLogged')
            this.state.name = localStorage.getItem('name')
            this.state.id = localStorage.getItem('id')

            this.props.history.push({
              pathname: '/',
              log: this.state.user_logged,
              usr_id: this.state.id,
              name: this.state.name
            });


          })
          .catch((error) => {
            console.log(error)
            alert("Incorrect Email or password!")
            window.location.href = "/"
          });

    }

    this.setState({
      email:'',
      password:''
    })
  }

  render() {
    if(this.state.user_logged){
      return(
          <fragment>
            <div>
              You are already logged into the system
            </div>
          </fragment>

      )
    }
    else{
      return (
          <div className="content-wrapper align-center">
            <div className="container">
              <form className="form-signin">
                <h2 className="form-signin-heading">Please sign in</h2>
                <div className="form-group">
                <label htmlFor="inputEmail" className="sr-only">
                  Email address
                </label>
                <input
                    type="email"
                    id="inputEmail"
                    className="form-control"
                    placeholder="Email address"
                    onChange={this.handleChange}
                    name="email"
                    required=""
                    autoFocus=""
                />
                </div>
                <div className="form-group">
                <label htmlFor="inputPassword" className="sr-only">
                  Password
                </label>
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Password"
                    onChange={this.handleChange}
                    name="password"
                    required=""
                />
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.handleSubmit}>
                  Sign in
                </button>
                {/*<div className="checkbox">*/}
                {/*  <label>*/}
                {/*    <a href="/user"> Create new user</a>*/}
                {/*  </label>*/}
                {/*</div>*/}
              </form>
            </div>
          </div>
      );
    }

  }
}

export default Login;
