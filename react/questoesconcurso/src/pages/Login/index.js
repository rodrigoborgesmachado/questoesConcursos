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
        await api.post(`/Token`, {username: email, password: stringToHash(senha)+''})
            .then((response) => {
                setLoadding(false);
                    sessionStorage.setItem(Config.LOGADO, 1);
                    sessionStorage.setItem(Config.USUARIO, response.data.username);
                    sessionStorage.setItem(Config.TOKEN, response.data.token);
                    //sessionStorage.setItem(Config.CodigoUsuario, response.data.CodigoUsuario);
                    //sessionStorage.setItem(Config.QUANTIDADE_QUESTOES_RESPONDIDAS, response.data.QuantidadeQuestoesResolvidas);
                    //sessionStorage.setItem(Config.QUANTIDADE_QUESTOES_ACERTADAS, response.data.QuantidadeQuestoesAcertadas);
                    toast.success('Bem vindo!');

                    //navigate('/', {replace: true});
                    window.location.href = '/';
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
        <div className="containerpage">
            <div className='login'>
                <h2>
                    Login
                </h2>
                <input type="email" name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required={true}></input>
                <h2>
                    Senha
                </h2>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required={true}></input>
                <a target='_blank' rel='noreferrer' href='http://concursando.sunsalesystem.com.br/EsqueciSenha.html'>Esqueci minha senha</a>
                <button onClick={logar}>Logar</button>
                <button onClick={criarUsuario}>Criar usuário</button>
            </div>
        </div>
    )
}

export default Login;