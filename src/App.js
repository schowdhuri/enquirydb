import { Component } from 'react';

class App extends Component {
	componentDidMount() {
		window.jQuery.material.init();
	}
  render() {
    return this.props.children;
  }
}

export default App;
