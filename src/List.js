import React, { Component } from 'react';
import { hashHistory, Link } from "react-router";
import moment from "moment";
import {
  Nav,
  Navbar,
  NavItem,
  Table,
  Well
} from "react-bootstrap";

import Alert from "./Alert";

import { exportCSV, importCSV } from "./CSV";
import db from "./DB";

import './List.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enquiries: [],
      importAlert: ""
    };
    this.loadDB = this.loadDB.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.navigateToAdd = this.navigateToAdd.bind(this);
    this.hideImportAlert = this.hideImportAlert.bind(this);
  }
  componentWillMount() {
    this.loadDB();
  }
  componentWillReceiveProps() {
    this.loadDB();
  }
  loadDB() {
    db.read().then(enquiries => {
      this.setState({ enquiries });
    });
  }
  handleExport() {
    exportCSV();
  }
  handleImport() {
    importCSV().then(result => {
      const numAdded = result[0];
      const numUpdated = result[1];
      this.setState({
        importAlert: `${numAdded} record(s) added\n${numUpdated} record(s) updated`
      });
      if(numAdded || numUpdated)
        this.loadDB();
    });
  }
  hideImportAlert() {
    this.setState({ importAlert: "" });
  }
  navigateToAdd() {
    hashHistory.push("/add");
  }
  render() {
    return (<div className="List">
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>EnquiryDB</Navbar.Brand>
        </Navbar.Header>
        <Nav className="pull-right">
          <NavItem eventKey={1} onClick={this.handleImport}>
            <i className="glyphicon glyphicon-folder-open" />
            Import
          </NavItem>
          <NavItem eventKey={2} onClick={this.handleExport}>
            <i className="glyphicon glyphicon-download-alt" />
            Export
          </NavItem>
          <NavItem eventKey={3} onClick={this.navigateToAdd}>
            <i className="glyphicon glyphicon-plus" />
            Add record
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
      <Alert show={Boolean(this.state.importAlert)}
        title="Import CSV"
        message={this.state.importAlert}
        button1="Ok"
        onClick={this.hideImportAlert} />
    </div>);
  }
}

export default List;
