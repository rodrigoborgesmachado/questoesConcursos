import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import {toast} from 'react-toastify';

function VerificadorUser(){
    const{guid} = useParams();
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(true);
    const[validado, setValidado] = useState(false);

    async function ValidaUsuario(){
        setLoadding(true);
        await api.get('/Usuarios/liberauser?guid=' + guid)
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                toast.success('Usuário validado com sucesso! Login liberado!');
            }
            else{
                toast.error('Não foi possível liberar o usuário!');
            }
        });
    }

    useEffect(() => {
        ValidaUsuario();
    }, [])

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="containerpage global-fullW">
            {
                validado ? 
                <p>
                    ⚠️Não foi possível liberar o usuário! Entre em contato com o suporte: sunsalesystem@outlook.com⚠️
                </p>
                :
                <p>
                    ✅Usuário validado! Login liberado!✅
                </p>
            }
        </div>
    )
}

export default VerificadorUser;