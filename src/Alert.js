import React, { Component } from 'react';
import {
	Button,
	Modal
} from "react-bootstrap";

class Alert extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
		this.close = this.close.bind(this);
		this.handleClick1 = this.handleClick1.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ show: nextProps.show });
	}
	close() {
		this.setState({ show: false });
		if(this.props.onHide)
			this.props.onHide();
	}
	handleClick1() {
		this.close();
		if(this.props.onClick1)
			this.props.onClick1();
	}
	render() {
		const {
			button1,
			button2,
			message,
			onClick2,
			title
		} = this.props;
		const { show } = this.state;
		return (<div>
			<Modal show={show} onHide={this.close} backdrop="static"> 
				<Modal.Header>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{message}
				</Modal.Body>

				{button1 || button2 ? <Modal.Footer>
					<Button onClick={this.handleClick1}>{button1}</Button>
					{button2 ? <Button onClick={onClick2}>{button2}</Button> : null}
				</Modal.Footer> : null}
			</Modal>
		</div>);
	}
}
Alert.propTypes = {
	show: React.PropTypes.bool,
	title: React.PropTypes.string,
	message: React.PropTypes.string,
	button1: React.PropTypes.string,
	button2: React.PropTypes.string,
	onClick1: React.PropTypes.func,
	onClick2: React.PropTypes.func,
	onHide: React.PropTypes.func
};

export default Alert;
