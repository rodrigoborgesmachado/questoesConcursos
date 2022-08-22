import './style.css';
import { useState } from 'react';
import Config from '../../config.json';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';

function CriarUsuario(){
    const navigate = useNavigate();

    const[nome, setNome] = useState('');
    const[email, setEmail] = useState('');
    const[senha, setSenha] = useState('');
    const[nascimento, setNascimento] = useState('');
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

    async function confirmaFormulario(){
        setLoadding(true);
        await api.post(`/InsereUsuario.php`, 
        {
            Nome: nome,
            Email: email,
            Password:stringToHash(senha),
            Datanascimento: nascimento
        }
        )
            .then((response) => {
                setLoadding(false);
                if(response.data.Sucesso){
                    sessionStorage.setItem(Config.LOGADO, 0);
                    sessionStorage.setItem(Config.USUARIO, '');
                    sessionStorage.setItem(Config.CodigoUsuario, '');
                    
                    toast.success('Usuário criado com sucesso! Login Liberado!');
                    navigate('/login', {replace: true});
                }
                else{
                    toast.error('Erro ao criar o usuário');
                }
            }).catch(() => {
                setLoadding(false);
                toast.error('Erro ao criar usuário');
                return;
            });
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

    return(
        <div className="containerpage">
            <div className='criarUsuario'>
                <h2>
                    Nome
                </h2>
                <input type='text' value={nome} onChange={(e) => setNome(e.target.value)}></input>
                <h2>
                    Email
                </h2>
                <input type='email' value={email} name='email' id='email' onChange={(e) => setEmail(e.target.value)}></input>
                <h2>
                    Senha
                </h2>
                <input type='password' value={senha} onChange={(e) => setSenha(e.target.value)}></input>
                <h2>
                    Data nascimento
                </h2>
                <input type='date' value={nascimento} onChange={(e) => setNascimento(e.target.value)}></input>
                <button onClick={confirmaFormulario}>Confirma</button>
            </div>
        </div>
    )
}

export default CriarUsuario;