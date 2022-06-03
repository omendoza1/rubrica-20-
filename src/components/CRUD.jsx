import React, { useState, useEffect } from 'react'
import RequirementsForm from './RequirementsForm'
import DataLog from './DataLog'
import { auth } from '../firebase-config/firebase';
import { useNavigate } from 'react-router-dom'
import { dataBase } from '../firebase-config/firebase';


const RequirementsCRUD = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [userList, setUserList] = useState([]);

    const createRequirement = async (newRequirement) => {
        await dataBase.collection(auth.currentUser.email).doc().set(newRequirement);
    }

    const updateRequirement = async (requirementId,requirementUpdate) => {
            await dataBase.collection(auth.currentUser.email).doc(requirementId).update(requirementUpdate);
    }

    const deleteRequirement = (requirementId) => {
        dataBase.collection(auth.currentUser.email).doc(requirementId).delete();
    }

    const getRequirementList = async () => {
        dataBase.collection(auth.currentUser.email).onSnapshot((userListQuery) => {
            const userListGet = [];
            userListQuery.forEach(element => {
                userListGet.push({ ...element.data(), id: element.id })
            });
            setUserList(userListGet)
        });
    };

    const getRequirementListArray = () => {
        return userList;
    }

    const getRequirementById = (requirementId) => {

     return  getRequirementListArray().filter(requirement => requirement.id === requirementId)[0];
       
    }

    useEffect(() => {
        //Obtener información del usuario logeado
        if (auth.currentUser) {
            setUser(auth.currentUser);
        } else {
            navigate('/login')
            console.log('Error')
        }
        getRequirementList();
    }, [navigate])

    return (
        <div>
            <RequirementsForm getRequirementListArray={getRequirementListArray} createRequirement={createRequirement}
             deleteRequirement={deleteRequirement}  getRequirementById={getRequirementById} updateRequirement={updateRequirement} />
        </div>
    )
}

export default RequirementsCRUD