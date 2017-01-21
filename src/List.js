import React, { Component } from 'react';
import { Link } from "react-router";
import moment from "moment";
import {
  Nav,
  Navbar,
  NavItem,
  Table,
  Well
} from "react-bootstrap";

import './List.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enquiries: []
    };
    this.loadDB = this.loadDB.bind(this);
  }
  componentWillMount() {
    this.loadDB();
  }
  componentWillReceiveProps() {
    this.loadDB();
  }
  loadDB() {
    const enquiries = JSON.parse(window.localStorage.getItem("enquiries") || "[]");
    this.setState({ enquiries });
  }
  render() {
    return (
      <div className="List">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>EnquiryDB</Navbar.Brand>
          </Navbar.Header>
          <Nav className="pull-right">
            <NavItem eventKey={1}>
              <Link className="nav-link" to="add">
                <i className="glyphicon glyphicon-plus" />
                {" "}New record
              </Link>
            </NavItem>
          </Nav>
        </Navbar>
        <div className="container">
          <Well>
            <Table striped hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ref No</th>
                  <th>Client</th>
                  <th>Enquiry</th>
                  <th>Arrival</th>
                  <th>Departure</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.enquiries && this.state.enquiries.length ? this.state.enquiries.map((row, index) => {
                  return (<tr key={row.ref}>
                    <td>{index + 1}</td>
                    <td>{row.ref}</td>
                    <td>
                      <div className="client-name">{row.clientName}</div>
                    </td>
                    <td>{moment(row.enquiryDate, "YYYY-MM-DD").format("DD MMM")}</td>
                    <td>{moment(row.arrivalDate, "YYYY-MM-DD").format("DD MMM")}</td>
                    <td>{moment(row.departureDate, "YYYY-MM-DD").format("DD MMM")}</td>
                    <td>
                      <Link to={`edit/${row.ref}`}>
                        <i className="glyphicon glyphicon-pencil" />
                      </Link>
                    </td>
                  </tr>);
                }) : <tr>
                  <td colSpan={7}>No enquiries saved</td>
                </tr>}
              </tbody>
            </Table>
          </Well>
        </div>
      </div>
    );
  }
}

export default List;
