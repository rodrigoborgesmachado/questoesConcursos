import './style.css';
import api from '../../services/api.js';
import Config from './../../config.json';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function RecoveryPass(){
    const navigate = useNavigate();
    const[email, setEmail] = useState('');
    const[loadding, setLoadding] = useState(false);

    async function reset(){
        setLoadding(true);
        await api.post(`/recuperasenha/recovery-pass?email=` + email + `&tipo=QuestoesAqui`)
            .then((response) => {
                if(response.data.success){
                    toast.success('Você receberá um email com as instruções para recuperação da senha!');
                }
                else{
                    toast.error('Usuário não encontrado!');
                }
                setLoadding(false);
                navigate('/', {replace: true});
            }).catch(() => {
                setLoadding(false);
                toast.error('Usuário não encontrado!');
                return;
            });
    }

    if(localStorage.getItem(Config.LOGADO) == 1){
        navigate('/', {replace: true});
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return (
        <div className="containerpage global-fullW">
            <div className='global-infoPanel login'>
                <h2>
                    Login
                </h2>
                <div className="separator"></div>
                <input type="email" name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required={true}></input>
                <button className='global-button global-button--full-width' onClick={reset}>Resetar a senha</button>
            </div>
        </div>
    )
}

export default RecoveryPass;