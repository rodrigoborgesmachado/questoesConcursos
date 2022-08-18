import './style.css';
import api from '../../services/api.js';
import Config from './../../config.json';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login(){
    const navigate = useNavigate();

    const[email, setEmail] = useState('');
    const[senha, setSenha] = useState('');
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

    async function logar(){
        setLoadding(true);
        await api.get(`/Logar.php?login=${email}&pass=${stringToHash(senha)}`)
            .then((response) => {
                setLoadding(false);
                if(response.data.Sucesso){
                    sessionStorage.setItem(Config.LOGADO, 1);
                    sessionStorage.setItem(Config.USUARIO, email);
                    sessionStorage.setItem(Config.CodigoUsuario, response.data.CodigoUsuario);
                    toast.success('Bem vindo!');

                    navigate('/', {replace: true});
                }
                else{
                    toast.error('Email ou senha incorretos');
                }
            }).catch(() => {
                setLoadding(false);
                toast.error('Erro ao logar');
                return;
            });
    }

    function criarUsuario(){
        navigate('/criarUsuario', {replace: true});
    }

    if(sessionStorage.getItem(Config.LOGADO) != null && sessionStorage.getItem(Config.LOGADO) === '1'){
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
        <div className='container'>
            <div className='login'>
                <h2>
                    Login
                </h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required={true}></input>
                <h2>
                    Senha
                </h2>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required={true}></input>
                <a target='_blank' href='http://concursando.sunsalesystem.com.br/EsqueciSenha.html'>Esqueci minha senha</a>
                <button onClick={logar}>Logar</button>
                <button onClick={criarUsuario}>Criar usuário</button>
            </div>
        </div>
    )
}

export default Login;