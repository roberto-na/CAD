import React, { useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './App.css';
import Cookies from 'universal-cookie';

import * as firebase from 'firebase/app'
import 'firebase/auth'

import Search from './components/Search';
import Login from './components/Login';
import Graph from './components/Graphs';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const config = {
  apiKey: "AIzaSyBbC69-D5LAOzM35SOhe5FUTFkoQzQkmcg",
  authDomain: "pcad-44a81.firebaseapp.com",
  databaseURL: "https://pcad-44a81.firebaseio.com",
  projectId: "pcad-44a81",
  storageBucket: "pcad-44a81.appspot.com",
  messagingSenderId: "764635075221",
  appId: "1:764635075221:web:7268bc2d70c452c436419c",
  measurementId: "G-3K6LW8BLNX"
}

if(!firebase.apps.length) {
  firebase.initializeApp(config)
}

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const cookies = new Cookies();
    if(cookies.get('user') && cookies.get('active_session')) {
      setUser(cookies.get('user'))
    }
  }, [])

  const loginProps = {
    config: config,
    setUser: setUser,
  }

  const searchProps = {
    config: config,
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/paciente'
            render={() => (<Graph {...searchProps} />)}/>
        {
          user
          ? <Route path='/'
          render={() => (<Search {...searchProps} />)}/>
          : <Route path='/'
          render={() => (<Login {...loginProps} />)}/>
        }
        </Switch>
      </Router>
    </div>
  );
}

export default App;
