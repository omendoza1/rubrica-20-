import React, { useState, useEffect } from 'react'
import { auth } from '../firebase-config/firebase';
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';

const RequirementsForm = ({ getRequirementListArray, createRequirement, deleteRequirement, getRequirementById, updateRequirement }) => {

    let userList = getRequirementListArray();

    //Categoría principal	
    const principalCategory = [{ value: 0, type: 'Selecione una categoría' }, { value: 1, type: 'Mantenimiento Inmuebles' },
    { value: 2, type: 'Mantenimiento Muebles' }, { value: 3, type: 'Servicios' }]

    //SubCategorias 
    const propertyMaintenance = [{ value: 0, type: 'Selecione una categoría' }, { value: 1, type: 'Baños' }, { value: 2, type: 'Cielo Raso' },
    { value: 3, type: 'Eléctrico' }, { value: 4, type: 'Pared' }, { value: 5, type: 'Puerta' }];

    const furnitureMaintenance = [{ value: 0, type: 'Selecione una categoría' }, { value: 1, type: 'Aire Acondicionado' }, { value: 2, type: 'Archivador' },
    { value: 3, type: 'Puesto de trabajo' }, { value: 4, type: 'Silla' }];

    const service = [{ value: 0, type: 'Selecione una categoría' }, { value: 1, type: 'Aseo' }, { value: 2, type: 'Transportes' }, { value: 3, type: 'Vigilancia' }];

    //Información de guardar
    const defaultValues = { category: '', subCategory: '', description: '', place: '', date: '' };
    const [values, setValues] = useState(defaultValues);

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [principalCategorySelect, setPrincipalCategorySelect] = useState(0);
    const [secundaryCategorySelect, setsecundaryCategorySelect] = useState(0);
    const [secundaryList, setSecundaryList] = useState([]);

    //Edit mode
    const defaultEditModeValues = { editMode: false, requirementId: '' };
    const [editMode, setEditMode] = useState(defaultEditModeValues);

    //Error 
    const defaultError = { existError: false, type: '' };
    const [error, setError] = useState(defaultError);

    //Envio de formulario
    const defatulFormSumit = { sended: false, message: '' };
    const [formSumit, setFormSumit] = useState(defatulFormSumit);

    //Confirmar borrar
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })
        setFormSumit(defatulFormSumit);
        setError(defaultError);
    };

    function deleteRequirementForm(requirementId) {

        setFormSumit(defatulFormSumit);

        if (editMode.requirementId != requirementId) {

            Swal.fire({
                title: 'Confirmación',
                text: "¿Esta seguro de borrar esta solicitud?",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Eliminado',
                        'Solicitud borrada',
                        'success'
                    )
                    deleteRequirement(requirementId)
                }
            })

        } else {
            setError({ existError: true, type: 'No puedes borrar una solicitud en edición.' })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //Crear Requirement
        if (!isAllComplete()) {
            return;
        }

        const temporalValues = { category: getPrincipalType(values.category), subCategory: getSecundaryType(values.category, values.subCategory), description: values.description, place: values.place, date: values.date };

        if (editMode.editMode) {

            Swal.fire({
                title: '¿Desea guardar los cambios de la solicitud?',

                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Guardar',

            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    Swal.fire('Solicitud Modificada', '', 'success')
                    updateRequirement(editMode.requirementId, temporalValues);
                    setEditMode({ defaultEditModeValues });
                    setFormSumit({ sended: true, message: 'Cambios realizados con exito' })
                    resetForm();
                }
            })

        } else {

            Swal.fire({
                title: '¿Desea crear la solicitud?',
                showCancelButton: true,
                icon: 'question',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Crear',

            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    Swal.fire('Solicitud creada', '', 'success')
                    createRequirement(temporalValues);
                    setFormSumit({ sended: true, message: 'Solicitud creada' })
                    resetForm();
                }
            })
        }
    }

    function resetForm() {
        //Agregar boton de confirmar
        setValues(defaultValues);
        setPrincipalCategorySelect(0);
        setError(defaultError);
        setsecundaryCategorySelect(0);
        setEditMode({ defaultEditModeValues });
    }

    function getPrincipalType(value) {
        return principalCategory[value].type;
    }

    function getSecundaryType(principalValue, secundaryValue) {

        if (principalValue == 1) {
            return propertyMaintenance[secundaryValue].type;
        }

        if (principalValue == 2) {
            return furnitureMaintenance[secundaryValue].type;
        }

        if (principalValue == 3) {
            return service[secundaryValue].type;
        }

    }

    function startEdit(requirementId) {

        setEditMode({ editMode: true, requirementId: requirementId });
        let requirement = getRequirementById(requirementId);
        let actualPrincipalCategory = principalCategory.filter(category => category.type === requirement.category)[0].value;
        let actualSubCategory = getSubCategorySelect(actualPrincipalCategory, requirement);
        setValues({ category: actualPrincipalCategory, subCategory: actualSubCategory, description: requirement.description, place: requirement.place, date: requirement.date });
        setPrincipalCategorySelect(actualPrincipalCategory);
        setsecundaryCategorySelect(actualSubCategory);
    }

    function getSubCategorySelect(categoryId, actualRequirement) {


        if (categoryId == 1) {
            let index = propertyMaintenance.filter(subCategory => subCategory.type == actualRequirement.subCategory)
            setSecundaryList(propertyMaintenance); return index[0].value;
        }

        if (categoryId == 2) {
            let index = furnitureMaintenance.filter(subCategory => subCategory.type == actualRequirement.subCategory)
            setSecundaryList(furnitureMaintenance);
            return index[0].value;
        }

        if (categoryId == 3) {
            let index = service.filter(subCategory => subCategory.type == actualRequirement.subCategory)
            setSecundaryList(service);
            console.log(index[0])
            return index[0].value;
        }
    }

    //Obtener información del usuario logeado
    useEffect(() => {

        if (auth.currentUser) {
            setUser(auth.currentUser);
        } else {

            Swal.fire({
                icon: 'error',
                title: 'Error de usuario',
                text: 'Debes iniciar sesión	para ingresar a las solicitudes.'
            })

            navigate('/login')
            console.log('Error')
        }
    }, [navigate])

    const getSelectedIndexPrincipal = (e) => {
        let indexValue = indexSelected(e);
        setPrincipalCategorySelect(indexValue);
        getSecundaryCategory(indexValue);
    }

    function indexSelected(e) {
        return e.target.value;
    }

    const getSelectedIndexSubCategory = (e) => {
        let indexValue = indexSelected(e);
        setsecundaryCategorySelect(indexValue);
    }

    function getSecundaryCategory(indexValue) {

        if (indexValue == 1) {
            setSecundaryList(propertyMaintenance);
        }

        if (indexValue == 2) {
            setSecundaryList(furnitureMaintenance);
        }

        if (indexValue == 3) {
            setSecundaryList(service);
        }
    }

    function isAllComplete() {

        if (principalCategorySelect == 0) {
            setError({ existError: true, type: 'Selecciona una categoría principal.' });
            return false;
        }
        if (secundaryCategorySelect == 0) {
            setError({ existError: true, type: 'Selecciona una sub-categoría. ' });;
            return false;
        }

        if (!values.description.trim()) {
            setError({ existError: true, type: 'Escriba la descripción.' });
            return false;
        }

        if (!values.place) {
            setError({ existError: true, type: 'Escriba la ubicación.' });
            return false;
        }

        if (!values.date) {
            setError({ existError: true, type: 'Escriba una fecha valida.' });
            return false;
        }
        return true;
    }


    return (

        <div className="  rounded requirements-container">

            <div className="requirements-container-form">
                <div className="row justify-content-center">
                    <div className=" margin-top form-container-card col col-12 col-sm-10 col-md-6 col-xl-4">
                       
                        {
                            editMode.editMode ? (

                                <h3 className="margin-top text-center ">Editar Solicitud</h3>

                            ) : (<h3 className="margin-top text-center ">Solicitud</h3>)
                        }

                        <hr />

                        {
                            error.existError ? (
                                <div className='alert alert-danger'>
                                    {error.type}
                                </div>
                            ) : null
                        }

                        <form name={values.category} onChange={handleInputChange} className='information-f' onSubmit={handleSubmit}>

                            <label>Categoría Principal</label>

                            <select value={principalCategorySelect} name='category' id="principalCategory" className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" onChange={getSelectedIndexPrincipal}>
                                {
                                    principalCategory.map((element, index) =>
                                        <option value={index} id={element.value} key={index}>{element.type}</option>
                                    )
                                }
                            </select>

                            <label>Sub-Categoría</label>

                            {
                                principalCategorySelect != 0 ? (

                                    <select value={secundaryCategorySelect} name='subCategory' onChange={getSelectedIndexSubCategory} id="secundaryCategory" className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                                        {
                                            secundaryList.map((element, index) =>
                                                <option value={index} id={element.value} key={index}>{element.type}</option>
                                            )
                                        }
                                    </select>
                                ) : <select id="secundaryCategory" className="form-select form-select-lg mb-3" disabled> </select>
                            }

                            <div className="form-group">
                                <label >Descripcion de solicitud</label>
                                <textarea className="form-control"
                                    id="description"
                                    name='description'
                                    rows="3"
                                    onChange={handleInputChange}
                                    value={values.description}
                                />
                            </div>

                            <div>
                                <label>Ubicación dentro de la empresa</label>
                                <input type="text"
                                    className='form-control mb-3'
                                    name='place'
                                    onChange={handleInputChange}
                                    value={values.place}
                                />
                            </div>

                            <div>
                                <label>Fecha de solicitud</label>
                                <input type="date"
                                    className='form-control mb-3'
                                    name='date'
                                    onChange={handleInputChange}
                                    value={values.date}
                                />
                            </div>

                            <div className=".border-radius d-grid gap-2">
                                <button className='btn btn-success ' type='submit'>Guardar</button>
                            </div>

                        </form>

                        <div className="margin-bottom margin-top d-grid gap-2 border-right ">
                            <button className='btn btn-danger' onClick={() => resetForm()}>Cancelar</button>
                        </div>

                    </div>

                </div>

            </div>

            <hr />

            <div>

                <div className=" margin-top margin-bottom logs-container requirements-container-list">
                    <h3 className=" margin-top margin-bottom text-center ">Registro de solicitudes</h3>
                    <hr />
                    <div className="row justify-content-center">

                        <div className="col col-12 col-sm-12">

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

                                            <td scope="row"><b>{index + 1}</b></td>
                                            <td>{element.id}</td>
                                            <td>{element.category}</td>
                                            <td>{element.subCategory}</td>
                                            <td>{element.description}</td>
                                            <td>{element.place}</td>
                                            <td>{element.date}</td>

                                            <td><button type="button" className="btn btn-primary" onClick={(e) => startEdit(element.id)}>Editar</button></td>
                                            <td><button type="button" className="btn btn-danger" onClick={() => deleteRequirementForm(element.id)} >Borrar</button></td>
                                        </tr>
                                    )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RequirementsForm