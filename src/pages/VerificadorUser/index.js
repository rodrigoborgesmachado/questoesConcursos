import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader.js';

function VerificadorUser(){
    const{guid} = useParams();
    const[loadding, setLoadding] = useState(true);
    const[validado, setValidado] = useState(false);

    
    useEffect(() => {
        async function ValidaUsuario(){
            setLoadding(true);
            await api.get('/Usuarios/liberauser?guid=' + guid)
            .then((response) => {
                if(response.data.success){
                    toast.success('Usuário validado com sucesso! Login liberado!');
                    setValidado(true);
                    setLoadding(false);
                }
                else{
                    toast.error('Não foi possível liberar o usuário!');
                    setValidado(false);
                    setLoadding(false);
                }
            });
        }
        ValidaUsuario();
    }, [guid])

    if(loadding){
        return(
            <PacmanLoader/>
        )
    }

    return(
        <div className="containerpage global-fullW">
            {
                !validado ? 
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