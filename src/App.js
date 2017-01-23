import { Component } from 'react';
import jQuery from "jquery";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.css";
import "bootstrap-material-design/dist/css/ripples.css";

window.jQuery = window.$ = jQuery;
require("bootstrap-material-design");
require("bootstrap-material-design/dist/js/ripples");

class App extends Component {
	componentDidMount() {
		window.jQuery.material.init();
	}
  render() {
    return this.props.children;
  }
}

export default App;
