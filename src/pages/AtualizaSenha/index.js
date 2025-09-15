import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Config from "../../config.json";
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader.js';


function AtualizaSenha(){
    const navigate = useNavigate();
    const[oldPass, setOldPass] = useState('');
    const[newPass, setNewPass] = useState('');
    const[loadding, setLoadding] = useState(false);

    function stringToHash(string) {

        let hash = 0;

        if (string.length === 0) return hash;

        for (let i = 0; i < string.length; i++) {
            let char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        return hash;
    }

    async function AtualizaSenha(){
        setLoadding(true);

        if(oldPass == '' || newPass == ''){
            toast.warn('Deve ser preenchido as senhas!');
            return;
        }

        await api.put(`/Usuarios/updateSenha?oldPass=` + stringToHash(oldPass) + `&newPass=` + stringToHash(newPass), {})
        .then((response) => {
            if(response.data.success){
                navigate('/perfil', true);
                toast.success('Atualizado com sucesso!');
            }
            else{
                toast.info(response.data.message);
                setLoadding(false);
            }
        }).catch(() => {
            setLoadding(false);
            toast.error('Erro ao atualizar!');
            return;
        });    
    }

    if(loadding){
        return(
            <PacmanLoader/>
        )
    }

    return(
        <div className="containerpage global-fullW">
            <div className='dados global-infoPanel'>
                <h2>
                    Atualização de senha
                </h2>
                <div className='separator separator--withMargins'></div>
                <div className='dadosResumidos'>
                    <p className='global-mt'>
                        Senha atual
                    </p>
                    <input type='password' className='global-input' value={oldPass} onChange={(e) => setOldPass(e.target.value)}/>
                    <p className='global-mt'>
                        Nova senha
                    </p>
                    <input type='password' className='global-input' value={newPass} onChange={(e) => setNewPass(e.target.value)}/>
                    <button className='global-button' onClick={() => AtualizaSenha()}>Atualizar</button>
                </div>
            </div>
        </div>
    )
}

export default AtualizaSenha;