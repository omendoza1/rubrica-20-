import React, { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { auth } from '../firebase-config/firebase';
import Swal from 'sweetalert2';

const Navbar = (props) => {

    const navigate = useNavigate();

    const signOutUser = () => {
        Swal.fire({
            title: '¿Desea cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Cerrar sesión',

        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Sesión cerrada con exito', '', 'success')
                auth.signOut()
                    .then(() => {
                        navigate('/login')
                    })
            }
        })

    }

    return (
        <div className="row justify-content-center">
            <div className="navbar navbar-dark bg-dark ">

                {
                    props.firebaseUser ? (<Link className="margin-left navbar-brand" to="/">{props.firebaseUser.email}</Link>)
                        : (<Link className="margin-left navbar-brand" to="/">Gestión</Link>)

                }

                <div>
                    <div className="d-flex">
                        <Link to="/" className="btn btn-dark">Inicio</Link>
                        {
                            props.firebaseUser ? (
                                <div>
                                    <Link to="requests" className="btn btn-dark">Solicitudes</Link>
                                    <button className="btn btn-dark" onClick={() => signOutUser()}>Cerrar Sesión</button>
                                </div>
                            ) : (
                                <div>
                                    <Link to="login" className="btn btn-dark">Iniciar Sesión</Link>
                                    <Link to="register" className="btn btn-dark">Registrarse</Link>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Navbar