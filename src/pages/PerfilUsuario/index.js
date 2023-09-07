import './style.css';
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import Config from "../../config.json";
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';
import Modal from 'react-modal';

const customStyles = {
    content: {
      top: '20%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      border: 0,
      background: '#424242',
      marginRight: '-50%',
      'border-radius': '5px',
      transform: 'translate(-50%, -50%)',
      width: '50%'
    },
  };

function PerfilUsuario(){
    const[usuario, setUsuario] = useState();
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(false);
    const[novoNome, setNovoNome] = useState('');
    const [modalNomeIsOpen, setIsOpenModalNome] = useState(false);

    function openModalNome() {
        setIsOpenModalNome(true);
    }

    function closeModalNome() {
        setIsOpenModalNome(false);
    }
    
    async function BuscaDadosUsuario(){
        setLoadding(true);
        await api.get('/Usuarios/getPerfil')
        .then((response) => {
            setLoadding(false);
            setUsuario(response.data.object);
        })
        .catch(() => {
            toast.warn('Erro ao buscar dados');
            navigate('/', true);
        });
    }
    
    useEffect(() => {

        if(localStorage.getItem(Config.LOGADO) === '1'){
            BuscaDadosUsuario();
        }
        else{
            navigate('/', true);
        }
    }, []);

    function openEditName(){
        setNovoNome(usuario.usuario.nome);
        openModalNome();
    }

    function openEditSenha(){
        navigate('/atualizasenha', true);
    }

    async function atualizaNome(){
        setLoadding(true);
        await api.put(`/Usuarios/updateName?name=` + novoNome, {})
        .then((response) => {
            if(response.data.success){
                toast.success('Atualizado com sucesso!');
                closeModalNome();
                BuscaDadosUsuario();
            }
            else{
                toast.info('Erro ao atualizar!');
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
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="containerpage global-fullW">
            <Modal
              isOpen={modalNomeIsOpen}
              onRequestClose={closeModalNome}
              style={customStyles}
              contentLabel="Atualização nome"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Nome:</h3>
                    </div>
                    <div className='separator separator--withMargins'></div>
                    <div className='global-buttonWrapper'>
                        <input type='text' className='global-input' value={novoNome} onChange={(e) => setNovoNome(e.target.value)}/>
                        <button className='global-button' onClick={() => atualizaNome()}>Atualizar</button>
                    </div>
                </div>
            </Modal>
            <div className='dados global-infoPanel'>
                <h2>
                    Dados do usuário
                </h2>
                <div className='separator separator--withMargins'></div>
                <div className='dadosResumidos'>
                    <p className='global-mt'>
                    Nome: {usuario?.usuario?.nome} <span onClick={() => openEditName()}>✎</span>
                    </p>
                    <p className='global-mt'>
                    Email: {usuario?.usuario?.email}
                    </p>
                    <p className='global-mt'>
                    Senha: ****** <span onClick={() => openEditSenha()}>✎</span>
                    </p>
                    <p className='global-mt'>
                    Perfil: {usuario?.usuario?.admin === "1" ? 'Administrador' : 'Aluno'}
                    </p>
                    <p className='global-mt'>
                    Quantidade de questões resolvidas: {usuario?.quantidadeQuestoesResolvidas}
                    </p>
                    <p className='global-mt'>
                    Quantidade de questões acertadas: {usuario?.quantidadeQuestoesAcertadas}
                    </p>
                    <p className='global-mt'>
                    Taxa de acertos:
                    </p>
                    
                    
                    
                    
                    
                </div>
                {/* <LinearProgressWithLabel  color="primary" value={parseInt((usuario?.quantidadeQuestoesAcertadas/usuario?.quantidadeQuestoesResolvidas) * 100)} /> */}
                <LinearProgressWithLabel className='global-mt' sx={{
                  backgroundColor: '#4B0082',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#8A2BE2'
                  }
                }} color="primary" value={parseInt((usuario?.quantidadeQuestoesAcertadas/usuario?.quantidadeQuestoesResolvidas) * 100)} />
            </div>
        </div>
    )    
}

export default PerfilUsuario;