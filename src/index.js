import React from 'react';
import {
	Router,
	Route,
	IndexRoute,
  hashHistory
} from 'react-router';
import ReactDOM from 'react-dom';

import App from "./App";
import AddEdit from "./AddEdit";
import List from './List';

import './index.css';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
			<IndexRoute component={List} />
      <Route path="add" component={AddEdit}/>
      <Route path="edit/:id" component={AddEdit}/>
    </Route>
  </Router>
), document.getElementById('root'));
