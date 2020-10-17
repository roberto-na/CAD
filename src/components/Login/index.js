import React from 'react';

const Login = () => {
  return (
    <section className="container-fluid">
      <section className="row justify-content-center">
        <section className="col-12 col-sm-6 col-md-4">
          <form id="login-form" className="content">
            <div className="form-group">
              <label htmlFor="log-usuario">Usuario</label>
              <input type="email" className="form-control" id="log-usuario" placeholder="ejemplo@mail.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="log-contrasena">Contraseña</label>
              <input type="password" className="form-control" id="log-contrasena" placeholder="Contraseña" required />
            </div>
            <button className="btn btn-primary">Iniciar sesión</button>
          </form>
        </section>
      </section>
    </section>
  )
}

export default Login
