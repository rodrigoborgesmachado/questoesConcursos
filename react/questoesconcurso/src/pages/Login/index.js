import './style.css';
import api from '../../services/api.js';
import Config from './../../config.json';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
                    localStorage.setItem(Config.LOGADO, 1);
                    localStorage.setItem(Config.USUARIO, response.data.username);
                    localStorage.setItem(Config.Nome, response.data.nome);
                    localStorage.setItem(Config.TOKEN, response.data.token);
                    localStorage.setItem(Config.ADMIN, response.data.admin);
                    //localStorage.setItem(Config.CodigoUsuario, response.data.CodigoUsuario);
                    //localStorage.setItem(Config.QUANTIDADE_QUESTOES_RESPONDIDAS, response.data.QuantidadeQuestoesResolvidas);
                    //localStorage.setItem(Config.QUANTIDADE_QUESTOES_ACERTADAS, response.data.QuantidadeQuestoesAcertadas);
                    toast.success('Bem vindo!');

                    //navigate('/', {replace: true});
                    window.location.href = '/';
            }).catch(() => {
                setLoadding(false);
                toast.error('Usuário ou senhas incorretos');
                return;
            });
    }

    function criarUsuario(){
        navigate('/criarUsuario', {replace: true});
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
                <h2>
                    Senha
                </h2>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required={true}></input>
                <Link className='botao' to={`/recoverypass`}>Esqueci minha senha</Link>
                <button onClick={logar}>Logar</button>
                <button onClick={criarUsuario}>Criar usuário</button>
            </div>
        </div>
    )
}

export default Login;