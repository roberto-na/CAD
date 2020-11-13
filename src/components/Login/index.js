import React, { useState } from 'react';
import Cookies from 'universal-cookie';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import Alert from '../Alert';

const Login = (props) => {

  const auth = firebase.auth()

  const [user, setUser] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState({
    type: '',
    message: '',
  })

  const handleChange = (target, name) => {
    setUser(prevState => ({
      ...prevState,
      [name]: target,
    }))
  }

  const login = () => {
    auth.signInWithEmailAndPassword(user.email, user.password)
    .then(async (response) => {
        const cookies = new Cookies();
        await cookies.set('active_session', 'true', {
          path: '/'
        });
        await cookies.set('user', response, {
          path: '/'
        });
        props.setUser(response)
      }).catch((err)  => {
        let errorCode = err.code
        let errorMessage = err.message
        if(errorCode === 'auth/wrong-password') {
          errorMessage = 'Invalid password'
        }
        setError({
          type: 'alert-danger',
          message: errorMessage,
        })
      })
  }

  return (
    <section className="container-fluid">
      <section className="row justify-content-center">
        <section className="col-12 col-sm-6 col-md-4">
          <div className="content">
          <Alert error={error} />
            <div className="form-group">
              <label>Usuario</label>
              <input
                value={user.email}
                type="email"
                onChange={(e) => {
                  handleChange(e.target.value, 'email')
                }}
                className="form-control"
                placeholder="ejemplo@mail.com"
                required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                value={user.password}
                type="password"
                onChange={(e) => {
                  handleChange(e.target.value, 'password')
                }}
                className="form-control"
                placeholder="Contraseña"
                required />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                login()
              }}>Iniciar sesión</button>
          </div>
        </section>
      </section>
    </section>
  )
}

export default Login
