import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token:'',
      is_logged: localStorage.getItem('userLogged'),
      // is_logged: this.props.is_logged,
      id: this.props.id,
      user_name: this.props.user_name
    }

  }

  reset(){
    this.props.history.push({
      pathname: '/reset',
      usr_id: this.state.id
    });
  }
  logout(){
    // localStorage.setItem('userLogged', false);
    window.location.href = "/"
    localStorage.clear()
  }

  render() {
    if ((this.state.is_logged == undefined) || (!this.state.is_logged)) {
      return (
          window.location.href = "/"
      )
    } else {
      return (
          <Fragment>
            <header className="main-header fixed">
              <a href="index2.html" className="logo">
                <span className="logo-lg">Summit Innovations</span>
              </a>
              <nav className="navbar navbar-static-top">
                <a
                    href="#"
                    className="sidebar-toggle"
                    data-toggle="push-menu"
                    role="button"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </a>

                <div className="navbar-custom-menu">
                  <ul className="nav navbar-nav">
                    <li>


                      <Link to={{
                        pathname: '/reset',
                        mystate: {
                          name: this.state.id
                        }
                      }}>
                        Reset Password
                      </Link>


                    </li>
                    <li>
                      <a href="">Hi {this.state.user_name}!</a>
                    </li>
                    <li>
                      <a href="" data-toggle="modal" data-target="#logout_modal">
                        <i className="fa fa-sign-out"></i> Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </header>

            <aside className="main-sidebar">
              <section className="sidebar">
                <ul className="sidebar-menu">
                  <li>
                    <Link to={`/`}>
                      <i className="fa fa-calendar"></i> &nbsp;&nbsp;
                      <span>Leave Calendar</span>
                      <span className="pull-right-container">
                  </span>
                    </Link>
                  </li>
                  <li className='panel-heading' role="tab"  data-toggle="collapse" data-target="#configuration-list">


                    <a> <i className="fa fa-gears"></i> &nbsp;&nbsp;Configurations
                      <span className="pull-right-container">
                    <i className="fa fa-angle-down pull-right"></i>
                  </span>
                    </a>


                  </li>
                  <div id="configuration-list" className="collapse">
                    <ul className="sidebar-menu">
                      <li>
                        <Link to={`/employee`}>
                          <i className="fa fa-users"></i> &nbsp;&nbsp;
                          <span>Employees</span>
                          <span className="pull-right-container">
                  </span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/leave_allocation`}>
                          <i className="fa fa-calendar-plus-o"></i> &nbsp;&nbsp;
                          <span>Leave Allocations</span>
                          <span className="pull-right-container">
                  </span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/leave_type`}>
                          <i className="fa fa-calendar-plus-o"></i> &nbsp;&nbsp;
                          <span>Leave Types</span>
                          <span className="pull-right-container">
                  </span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/designation`}>
                          <i className="fa fa-calendar-plus-o"></i> &nbsp;&nbsp;
                          <span>Designation</span>
                          <span className="pull-right-container">
                  </span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/public-holidays`}>
                          <i className="fa fa-moon-o"></i> &nbsp;&nbsp;
                          <span>Public Holidays</span>
                          <span className="pull-right-container">
                  </span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/user`}>
                          <i className="fa fa-user"></i> &nbsp;&nbsp;
                          <span>User</span>
                          <span className="pull-right-container">

                  </span>
                        </Link>
                      </li>
                    </ul>
                  </div>


                </ul>
              </section>
            </aside>

            <div
                className="modal fade"
                tabIndex="-1"
                role="dialog"
                id="logout_modal"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Logout</h4>
                  </div>
                  <div className="modal-body">
                    <span>Are you sure want to logout ?</span>
                  </div>
                  <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-default"
                        data-dismiss="modal"
                    >
                      {" "}
                      No
                    </button>
                    <a
                        // href="<?php echo base_url('login/logout'); ?>"
                        //   href={"/"}
                        onClick={this.logout}
                        className="btn btn-success"
                    >
                      {" "}
                      Yes{" "}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
      );
    }

  }
}

export default Header;
