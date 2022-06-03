import React from 'react'

const DataLog = ({ getRequirementListArray, deleteRequirement }) => {

    let userList = getRequirementListArray();

   
    return (
        <div>

            <h3 className="text-center ">Registro de requerimientos</h3>

            <div className="requirements-container-list">
                <div className="row justify-content-center">

                    <div className="col col-12 col-sm-10  ">

                        <table className="table table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">id</th>
                                    <th scope="col">Categoría Principal</th>
                                    <th scope="col">Sub-Categoría</th>
                                    <th scope="col">Descripcion de solicitud</th>
                                    <th scope="col">Ubicación dentro de la empresa</th>
                                    <th scope="col">Fecha de solicitud</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>

                                {userList.map((element, index) =>
                                    <tr key={index}>

                                        <th scope="row">{index + 1}</th>
                                        <td>{element.id}</td>
                                        <td>{element.category}</td>
                                        <td>{element.subCategory}</td>
                                        <td>{element.description}</td>
                                        <td>{element.place}</td>
                                        <td>{element.date}</td>
                                        <td><button type="button" className="btn btn-primary">Editar</button></td>
                                        <td><button type="button" className="btn btn-danger" onClick={() => deleteRequirement(element.id)} >Borrar</button></td>

                                    </tr>
                                )
                                }

                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default DataLog









