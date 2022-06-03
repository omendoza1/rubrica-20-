
import React, { useState, useCallback } from 'react'
import { auth } from '../firebase-config/firebase';
import { useNavigate } from 'react-router-dom/'
import { Link } from 'react-router-dom'

const Login = (verifyLogin) => {

  const defaultValues = { email: '', password: '' };
  const defaultError = { existError: false, type: '' };

  const [values, setValues] = useState(defaultValues);
  const [error, setError] = useState(defaultError);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value })
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!isAllComplete()) {
      return;
    }
    // verifyLogin(values);
    

    login();

  }

  const login = useCallback(async () => {

    try {
      const res = await auth.signInWithEmailAndPassword(values.email, values.password)
      setError(defaultError);
      navigate("/requests")
    } catch (error) {
      console.log(error);

      if (error.code == 'auth/invalid-email') {
        setError({ existError: true, type: 'Email no valido' });
      }

      if (error.code == 'auth/user-not-found') {
        setError({ existError: true, type: 'Correo no registrado' });
      }

      if (error.code == 'auth/wrong-password') {
        setError({ existError: true, type: 'Correo/Contraseña invalidos' });

      }
    }

  }, [values.email, values.password])

  function isAllComplete() {

    if (!values.email.trim()) {
      setError({ existError: true, type: 'Escriba su correo electronico' });
      return false;
    }

    if (!values.password.trim()) {
      setError({ existError: true, type: 'Escriba su contraseña' });
      return false;
    }

    return true;
  }

  return (
    <div className="form-container-login">

     

      <div className="row justify-content-center">

        <div className=" form-container-card col col-12 col-sm-10 col-md-6 col-xl-4">
        <h3 className=" title margin-top margin-bottom text-center ">Login de Usuario</h3>
        <hr />
          <img src={logo} alt='userImgView' className='userRegisterImg mx-auto d-block'></img>

          <form className='information-f' onSubmit={handleSubmit}>

            {
              error.existError ? (
                <div className='alert alert-danger'>
                  {error.type}
                </div>
              ) : null
            }

            <input type="email"
              className='form-control mb-3'
              name='email'
              placeholder='Correo electronico'
              onChange={handleInputChange}
              value={values.email}
            />

            <input type="password"
              className='form-control mb-3'
              name='password'
              placeholder='Contraseña'
              onChange={handleInputChange}
              value={values.password}
              autoComplete="off"
            />

            <div className="d-grid gap-2">
              <button className='btn btn-dark ' type='submit'>Iniciar Sesión</button>
              <Link to="/register" className="btn btn-dark ">Registrarse</Link>
            </div>

          </form>

        </div>

      </div>

    </div>
  )
}

export default Login