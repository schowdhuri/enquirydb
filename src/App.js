import { Component } from 'react';
import jQuery from "jquery";
window.jQuery = window.$ = jQuery;

require("bootstrap-material-design");
require("bootstrap-material-design/dist/js/ripples");

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.css";
import "bootstrap-material-design/dist/css/ripples.css";

class App extends Component {
	componentDidMount() {
		window.jQuery.material.init();
	}
  render() {
    return this.props.children;
  }
}

export default App;
