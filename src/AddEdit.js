import React, { Component } from 'react';
import { browserHistory, Link } from "react-router";
import DatePicker from 'react-datepicker';
import moment from "moment";
import shortId from "shortid";
import {
	Button,
	ButtonToolbar,
  Col,
  ControlLabel,
  Form,
  FormGroup,
  FormControl,
  Nav,
  Navbar,
  NavItem,
  Row,
  Well
} from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";
import "./Add.css";

const FIELDS = [
	"ref",
	"clientName",
	"enquiryDate",
	"paxNum",
	"contactPerson",
	"arrivalDate",
	"departureDate",
	"pickup",
	"drop",
	"mode",
	"destination",
	"hotel",
	"mealPlan",
	"transport",
	"inclusions",
	"exclusions",
	"extra",
	"remarks"
];

class AddEdit extends Component {
	constructor(props) {
		super(props);

		this.state = FIELDS.reduce((p, c) => {
			return {
				...p,
				[c]: ""
			};
		}, {});
		this.loadDB = this.loadDB.bind(this);
		this.handleChangeValue = this.handleChangeValue.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}
	componentWillMount() {
		if(this.props.params && this.props.params.id)
			this.loadDB(this.props.params.id);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.params && nextProps.id)
			this.loadDB(this.props.params.id);
	}
	loadDB(id) {
		const savedData = JSON.parse(window.localStorage.getItem("enquiries") || "[]");
		if(savedData instanceof Array) {
			const record = savedData.find(r => r.ref === id);
			const data = FIELDS.reduce((p, c) => {
				if(c.toLowerCase().indexOf("date")>=0) {
					return {
						...p,
						[c]: record[c] && moment(record[c], "YYYY-MM-DD")
					};
				}
				return {
					...p,
					[c]: record[c]
				};
			}, {});
			this.setState(data);
		}
	}
	handleChangeValue(e, key) {
		if(key.toLowerCase().indexOf("date")>=0) {
			this.setState({
				[key]: e
			});
		} else {
			this.setState({
				[key]: e.target.value
			});
		}
	}
	handleDelete() {
		let savedData = JSON.parse(window.localStorage.getItem("enquiries") || "[]");
		if(savedData instanceof Array) {
			const index = savedData.findIndex(r => r.ref===this.state.ref);
			if(index >= 0) {
				savedData = [
					...savedData.slice(0, index),
					...savedData.slice(index + 1)
				];
			}
		}
		window.localStorage.setItem("enquiries", JSON.stringify(savedData));
		browserHistory.push("/");
	}
	handleSave() {
		const record = FIELDS.reduce((p, c) => {
			if(c.toLowerCase().indexOf("date")>=0) {
				return {
					...p,
					[c]: this.state[c] && this.state[c].format("YYYY-MM-DD")
				};
			}
			return {
				...p,
				[c]: this.state[c]
			};
		}, {});
		record.ref = record.ref || shortId.generate().toUpperCase() + moment().format("YYYY");
		let savedData = JSON.parse(window.localStorage.getItem("enquiries") || "[]");
		if(!(savedData instanceof Array))
			savedData = [];
		const index = savedData.findIndex(r => r.ref===record.ref);
		if(index >= 0) {
			savedData = [
				...savedData.slice(0, index),
				record,
				...savedData.slice(index + 1)
			];
		} else {
			savedData.push(record);
		}
		window.localStorage.setItem("enquiries", JSON.stringify(savedData));
		browserHistory.push("/");
	}
  render() {
    return (<div className="App">
      <Navbar>
      	<Nav className="pull-left">
		      <NavItem eventKey={1}>
            <Link className="nav-link" to="/">
            	<i className="glyphicon glyphicon-home" />
            </Link>
          </NavItem>
        </Nav>
		    <Navbar.Header>
		      <Navbar.Brand>New Record</Navbar.Brand>
		    </Navbar.Header>
		    <Nav className="pull-right">
		      {this.state.ref ? <NavItem eventKey={2} onClick={this.handleDelete}>
		      	<i className="glyphicon glyphicon-trash" />
		      	Delete
	      	</NavItem> : null}
	      	<NavItem eventKey={2} onClick={this.handleSave}>
		      	<i className="glyphicon glyphicon-ok" />
		      	Save
	      	</NavItem>
		    </Nav>
		  </Navbar>
      <div className="container">
      	<Well>
          <Form>
            <FormGroup controlId="clientName">
              <ControlLabel>Client Name</ControlLabel>
              <FormControl
              	value={this.state.clientName}
              	onChange={e => this.handleChangeValue(e, "clientName")} />
            </FormGroup>

            <Row>
            	<Col sm={6}>
		            <FormGroup controlId="enquiryDate">
		              <ControlLabel>Enquiry Date</ControlLabel>
		              <DatePicker
		              	className="form-control"
		              	dateFormat="DD MMM YYYY"
		              	selected={this.state.enquiryDate || null}
              			onChange={e => this.handleChangeValue(e, "enquiryDate")} />
		            </FormGroup>
            	</Col>
            	<Col sm={6}>
		            <FormGroup controlId="paxNum">
		              <ControlLabel>No. of Pax</ControlLabel>
		              <FormControl
		              	value={this.state.paxNum}
              			onChange={e => this.handleChangeValue(e, "paxNum")} />
		            </FormGroup>
            	</Col>
          	</Row>

            <FormGroup controlId="contactPerson">
              <ControlLabel>Contact Person</ControlLabel>
              <FormControl
              	value={this.state.contactPerson}
              	onChange={e => this.handleChangeValue(e, "contactPerson")} />
            </FormGroup>

            <Row>
            	<Col sm={6}>
		            <FormGroup controlId="arrivalDate">
		              <ControlLabel>Arrival Date</ControlLabel>
		              <DatePicker
		              	className="form-control"
		              	dateFormat="DD MMM YYYY"
		              	selected={this.state.arrivalDate || null}
              			onChange={e => this.handleChangeValue(e, "arrivalDate")} />
		            </FormGroup>
            	</Col>
            	<Col sm={6}>
	            	<FormGroup controlId="departureDate">
		              <ControlLabel>Departure Date</ControlLabel>
		              <DatePicker
		              	className="form-control"
		              	dateFormat="DD MMM YYYY"
		              	selected={this.state.departureDate || null}
              			onChange={e => this.handleChangeValue(e, "departureDate")} />
		            </FormGroup>
	            </Col>
	          </Row>
	            
            <FormGroup controlId="pickup">
              <ControlLabel>Pickup</ControlLabel>
              <FormControl
              	value={this.state.pickup}
              	onChange={e => this.handleChangeValue(e, "pickup")} />
            </FormGroup>

            <FormGroup controlId="drop">
              <ControlLabel>Drop</ControlLabel>
              <FormControl
              	value={this.state.drop}
              	onChange={e => this.handleChangeValue(e, "drop")} />
            </FormGroup>

            <FormGroup controlId="mode">
              <ControlLabel>Mode</ControlLabel>
              <FormControl
              	value={this.state.mode}
              	onChange={e => this.handleChangeValue(e, "mode")} />
            </FormGroup>

            <FormGroup controlId="destination">
              <ControlLabel>Destination</ControlLabel>
              <FormControl
              	value={this.state.destination}
              	onChange={e => this.handleChangeValue(e, "destination")} />
            </FormGroup>

            <FormGroup controlId="hotel">
              <ControlLabel>Hotel</ControlLabel>
              <FormControl
              	value={this.state.hotel}
              	onChange={e => this.handleChangeValue(e, "hotel")} />
            </FormGroup>

            <FormGroup controlId="mealPlan">
              <ControlLabel>Meal Plan</ControlLabel>
              <FormControl
              	value={this.state.mealPlan}
              	onChange={e => this.handleChangeValue(e, "mealPlan")} />
            </FormGroup>

            <FormGroup controlId="transport">
              <ControlLabel>Transport</ControlLabel>
              <FormControl
              	value={this.state.transport}
              	onChange={e => this.handleChangeValue(e, "transport")} />
            </FormGroup>

            <FormGroup controlId="inclusions">
              <ControlLabel>Inclusions</ControlLabel>
              <FormControl
              	value={this.state.inclusions}
              	onChange={e => this.handleChangeValue(e, "inclusions")} />
            </FormGroup>

            <FormGroup controlId="exclusions">
              <ControlLabel>Exclusions</ControlLabel>
              <FormControl
              	value={this.state.exclusions}
              	onChange={e => this.handleChangeValue(e, "exclusions")} />
            </FormGroup>

            <FormGroup controlId="extra">
              <ControlLabel>Extra</ControlLabel>
              <FormControl
              	value={this.state.extra}
              	onChange={e => this.handleChangeValue(e, "extra")} />
            </FormGroup>

            <FormGroup controlId="remarks">
              <ControlLabel>Remarks</ControlLabel>
              <FormControl
              	value={this.state.remarks}
              	onChange={e => this.handleChangeValue(e, "remarks")} />
            </FormGroup>
          </Form>
        </Well>
      </div>
    </div>);
  }
}

export default AddEdit;
