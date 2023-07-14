import './style.css';
import api from '../../services/api.js';
import Config from './../../config.json';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPass(){
    const navigate = useNavigate();
    const[senha, setSenha] = useState('');
    const{guid} = useParams();
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

    async function reset(){
        setLoadding(true);
        await api.post(`/recuperasenha/reset-pass?guid=` + guid + '&pass=' + stringToHash(senha) + `&tipo=QuestoesAqui`)
            .then((response) => {
                setLoadding(false);
                if(response.data.success){
                    toast.success('Login liberado com a nova senha!');
                    navigate('/login', {replace: true});
                }
                else{
                    toast.error('Usuário não encontrado!');
                    navigate('/', {replace: true});
                }
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
                    Nova senha
                </h2>
                <input type="password" name='pass' id='pass' value={senha} onChange={(e) => setSenha(e.target.value)} required={true}></input>
                <button onClick={reset}>Resetar a senha</button>
            </div>
        </div>
    )
}

export default ResetPass;