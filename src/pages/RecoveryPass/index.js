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
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

    return (
        <div className="containerpage">
            <div className='login'>
                <h2>
                    Login
                </h2>
                <input type="email" name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required={true}></input>
                <button onClick={reset}>Resetar a senha</button>
            </div>
        </div>
    )
}

export default RecoveryPass;