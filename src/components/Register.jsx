import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { dataBase, auth } from '../firebase-config/firebase';
import logo from '../img/img1.jpg'
import { useNavigate } from 'react-router-dom/'

const Register = () => {
  const defaultValues = { id: '', name: '', lastName: '', age: '', address: '', email: '', password: '' };
  const defaultError = { existError: false, type: '' };
  const [values, setValues] = useState(defaultValues);
  const [error, setError] = useState(defaultError);
  const [successRegister, setSuccessRegister] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value })
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    setSuccessRegister(false)
    if (!isAllComplete(values.age)) {
      return;
    }

    setError(defaultError);
    register();

  }

  const register = useCallback(async () => {

    try {

      const res = await auth.createUserWithEmailAndPassword(values.email, values.password);

      await dataBase.collection('usuariosbd').doc(res.user.email).set(
        {
          email: res.user.email,
          id: res.user.uid
        }
      )
      navigate("/requests")
      await dataBase.collection(res.user.email).add()
      setValues(defaultValues);


    } catch (error) {
      console.log(error);

      if (error.code == 'auth/email-already-in-use') {
        setError({ existError: true, type: 'Email ya registrado' });
      }
    }

  }, [values.email, values.password]);

  function isAllComplete(age) {
    
    if (!values.email.trim()) {
      setError({ existError: true, type: 'Escriba su correo electronico' });
      return false;
    }

    if (!values.password.trim()) {
      setError({ existError: true, type: 'Escriba su contraseña' });
      return false;
    }

    if (values.password.length < 8) {
      setError({ existError: true, type: 'La contraseña de tener mas de 8 caracteres' });
      return false;
    }
    return true;
  }


  return (

    <div className=" .white-backgroud form-container-login">


      <div className="row justify-content-center">

        <div className=" form-container-card col col-12 col-sm-10 col-md-6 col-xl-4">
          <h3 className=" title margin-top margin-bottom text-center ">Registrar Usuario</h3>
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

            {
              successRegister ? (
                <div className="alert alert-success" role="alert">
                  Registro de usuario realizado, click <Link to="/login" className="successRegister" >aquí</Link> para iniciar sesión.
                </div>
              ) : null
            }

            <input hidden type="text"
              className='form-control mb-3'
              name='name'
              placeholder='Nombre'
              onChange={handleInputChange}
              value={values.name}
            />
            <input hidden type="text"
              className='form-control mb-3'
              name='lastName'
              placeholder='Apellido'
              onChange={handleInputChange}
              value={values.lastName}
            />

            <input hidden type="text"
              className='form-control mb-3'
              name='age'
              placeholder='Edad'
              onChange={handleInputChange}
              value={values.age}
            />

            <input hidden type="text"
              className='form-control mb-3'
              name='address'
              placeholder='Dirección'
              onChange={handleInputChange}
              value={values.address}
            />

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
              <button className='btn btn-dark ' type='submit'>Registrarse</button>
              <Link to="/login" className="btn btn-dark">Iniciar Sesión</Link>
            </div>

          </form>

        </div>

      </div>
    </div>

  )
}

export default Register