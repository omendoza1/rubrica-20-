import React from 'react'

const Home = () => {
  return (
    <div className="form-container-login">

      <div className="row justify-content-center col-12">

        <div className=" margin form-container-card col col-10 col-sm-10 col-md-6 col-xl-4">
          <h3 className=" title margin-top margin-bottom  ">Sistema de solicitudes</h3>
          <hr />
          <div>
            <p>Crea y edita tus solicitudes, recuerda que debes completar todos los campos requeridos.</p>
          </div>

        </div>
        <div className=" margin form-container-card col col-10 col-sm-10 col-md-6 col-xl-4">
          <h3 className=" title margin-top margin-bottom  ">Gestión de solicitudes</h3>
          <hr />
          <div>
            <p>Regístrate para acceder a la creación y edición de solicitudes.</p>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Home