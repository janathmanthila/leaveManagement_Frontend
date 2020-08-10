import React, { Component, Fragment } from "react";
import axios from "axios";

class Holidays extends Component {
    constructor(props) {
        super(props);
        this.state = {
            holidays: [],
        };
    }

    componentDidMount() {
        axios
            .get("http://localhost:9000/holiday")
            .then((response) => {
                this.setState({holidays: response.data})
            })
            .catch((error) => console.log(error.response));
    }

    getHolidays = () => {
        return this.state.holidays.map((holiday) => {
            return (
                <tr>
                    <td>{holiday.startDate}</td>
                    <td>{holiday.holidayName}</td>
                    <td>{holiday.holidayDescription }</td>
                    <td width="20%">{holiday.holidayType }</td>
                </tr>
            );
        });
    };

    render() {
        return (
            <Fragment>
                <div className="content-wrapper">
                    <section className="content-header">
                        <h1>Holidays</h1>
                        <ol className="breadcrumb">
                            <li>
                                <a href="#">
                                    <i className="fa fa-users"></i> Home
                                </a>
                            </li>
                            <li>
                                <a href="#">Holidays</a>
                            </li>
                        </ol>
                    </section>

                    <section className="content">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box">
                                    <div className="box-body">
                                        <div className="row">
                                            <div className="col-md-12"></div>
                                        </div>
                                    </div>

                                    <div className="content">
                                        <table className="table table-bordered table-striped table-responsive">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Holiday Name</th>
                                                    <th>Description</th>
                                                    <th>Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>{this.getHolidays()}</tbody>
                                        </table>
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
export default Holidays;
