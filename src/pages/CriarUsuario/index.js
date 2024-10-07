import './style.css';
import { useState } from 'react';
import Config from '../../config.json';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function CriarUsuario(){
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();

    const[nome, setNome] = useState('');
    const[email, setEmail] = useState('');
    const[senha, setSenha] = useState('');
    const[nascimento, setNascimento] = useState('');
    const[instituicao, setInstituicao] = useState('');
    const[perfis] = useState([
        {
            value:0,
            label:'Aluno'
        },
        {
            value:2,
            label:'Professor'
        },
    ]);
    const[perfilSelecionado, setPerfilSelecionado] = useState(0);
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

    function logarUsuario() {
        navigate('/login', { replace: true });
    }

    async function confirmaFormulario(){
        setLoadding(true);
        await api.post(`/Usuarios?perfil=${perfilSelecionado}`, 
        {
            login: email,
            nome: nome,
            email: email,
            pass:stringToHash(senha)+'',
            dataNascimento: nascimento,
            instituicao: instituicao
        }
        )
        .then((response) => {
            if(response.data.success){
                toast.success('Usuário criado com sucesso! Login liberado!');
                navigate('/login', {replace: true});
            }
            else{
                toast.info('Já existe um usuário com esse email!');
                setSenha('');
            }
            setLoadding(false);
        }).catch(() => {
            setLoadding(false);
            toast.error('Erro ao criar usuário');
            return;
        });
    }

    const handleChange = (selectedOption, event) => {
        setPerfilSelecionado(selectedOption.value);
    }

    if(localStorage.getItem(Config.LOGADO) != null && localStorage.getItem(Config.LOGADO) === '1'){
        navigate('/', {replace: true});
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="global-pageContainer">
            <div className='global-infoPanel global-miniW login'>
            <div className='login-wrapper'>
                        <div className='login-unselected' onClick={logarUsuario}>
                            Logar
                        </div>
                        <div className='login-selected'>
                            Registrar
                        </div>
                    </div>
                    <div className='separator'></div>
                <label for="nome">Nome:</label>
                <input id='nome' type='text' value={nome} onChange={(e) => setNome(e.target.value)}></input>
                <label for="email">Email:</label>
                <input type='email' value={email} name='email' id='email' onChange={(e) => setEmail(e.target.value)}></input>
                <label for="password">Senha:</label>
                <input id='password' type='password' value={senha} onChange={(e) => setSenha(e.target.value)}></input>
                <label for="date">Data nascimento:</label>
                <input id='date' type='date' value={nascimento} onChange={(e) => setNascimento(e.target.value)}></input>
                <label for="perfil">Perfil:</label>
                <div id='perfil' className="opcoes">
                    <Select closeMenuOnSelect={false} components={animatedComponents} options={perfis} onChange={handleChange} />
                </div>
                <label for="date">Instituição:</label>
                <input id='date' type='text' value={instituicao} selectedOption={perfilSelecionado} onChange={(e) => setInstituicao(e.target.value)}></input>

                <button className='global-button global-button--full-width' onClick={confirmaFormulario}>Confirma</button>
            </div>
            
        </div>
    )
}

export default CriarUsuario;