import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import * as firebase from 'firebase/app'

import Search from './components/Search';
import Login from './components/Login';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/search' component={Search} />
          <Route path='/' component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
