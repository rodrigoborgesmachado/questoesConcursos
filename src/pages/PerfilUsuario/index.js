import './style.css';
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import Config from "../../config.json";
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';
import Modal from 'react-modal';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { customStyles } from '../../services/functions.js';

function PerfilUsuario(){
    const style = customStyles();
    const animatedComponents = makeAnimated();
    const[usuario, setUsuario] = useState();
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(false);
    const[novoNome, setNovoNome] = useState('');
    const[novoInstituicao, setNovaInstituicao] = useState('');
    const [modalNomeIsOpen, setIsOpenModalNome] = useState(false);
    const [modalInsituicaoIsOpen, setIsOpenModalInsituicao] = useState(false);
    const [modalPerfilIsOpen, setIsOpenModalPerfil] = useState(false);
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

    function openModalNome() {
        setIsOpenModalNome(true);
    }

    function closeModalNome() {
        setIsOpenModalNome(false);
    }

    function openModalInstituicao() {
        setIsOpenModalInsituicao(true);
    }

    function closeModalInstituicao() {
        setIsOpenModalInsituicao(false);
    }

    function openModalPerfil() {
        setIsOpenModalPerfil(true);
    }

    function closeModalPerfil() {
        setIsOpenModalPerfil(false);
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

    function openEditInstituicao(){
        setNovoNome(usuario.usuario.instituicao);
        openModalInstituicao();
    }

    function openEditPerfil(){
        setPerfilSelecionado(usuario.usuario.tipoPerfil.Id);
        openModalPerfil();
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

    async function atualizaInstituicao(){
        setLoadding(true);
        await api.put(`/Usuarios/updateInstituicao?instituicao=` + novoInstituicao, {})
        .then((response) => {
            if(response.data.success){
                toast.success('Atualizado com sucesso!');
                closeModalInstituicao();
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

    async function atualizaPerfil(){
        setLoadding(true);
        await api.put(`/Usuarios/updatePerfil?perfil=` + perfilSelecionado, {})
        .then((response) => {
            if(response.data.success){
                toast.success('Atualizado com sucesso!');
                closeModalPerfil();
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

    const handleChange = (selectedOption, event) => {
        setPerfilSelecionado(selectedOption.value);
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
              style={style}
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
            <Modal
              isOpen={modalInsituicaoIsOpen}
              onRequestClose={closeModalInstituicao}
              style={style}
              contentLabel="Atualização Instituicao"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Insituição:</h3>
                    </div>
                    <div className='separator separator--withMargins'></div>
                    <div className='global-buttonWrapper'>
                        <input type='text' className='global-input' value={novoInstituicao} onChange={(e) => setNovaInstituicao(e.target.value)}/>
                        <button className='global-button' onClick={() => atualizaInstituicao()}>Atualizar</button>
                    </div>
                </div>
            </Modal>
            <Modal
              isOpen={modalPerfilIsOpen}
              onRequestClose={closeModalPerfil}
              style={style}
              contentLabel="Atualização de Perfil"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Perfil:</h3>
                    </div>
                    <div className='separator separator--withMargins'></div>
                    <div className='global-buttonWrapper'>
                        <div className='opcoes'>
                            <Select closeMenuOnSelect={false} components={animatedComponents} options={perfis} onChange={handleChange} />
                        </div>
                        <button className='global-button' onClick={() => atualizaPerfil()}>Atualizar</button>
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
                    Perfil: {usuario?.usuario?.tipoPerfil?.descricao} <span onClick={() => openEditPerfil()}>✎</span>
                    </p>
                    <p className='global-mt'>
                    Instituição: {usuario?.usuario?.instituicao}<span onClick={() => openEditInstituicao()}>✎</span>
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
                  backgroundColor: Config.pallete[0],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#8A2BE2'
                  }
                }} color="primary" value={parseInt((usuario?.quantidadeQuestoesAcertadas/usuario?.quantidadeQuestoesResolvidas) * 100)} />
            </div>
        </div>
    )    
}

export default PerfilUsuario;