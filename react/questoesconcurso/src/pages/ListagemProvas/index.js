import './style.css';
import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import Config from "../../config.json";
import { BsFunnelFill, BsFileEarmarkPlusFill } from "react-icons/bs";
import Modal from 'react-modal';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';

const customStyles = {
    content: {
      top: '30%',
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

function ListagemProvas(){
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(true);
    const[provas, setProvas] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [filtroNome, setFiltroNome] = useState('');
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(7);

    function openModal() {
        setIsOpen(true);
    }
    
    function closeModal() {
        setIsOpen(false);
    }

    async function buscaProvas(page, semFiltro){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get('/Prova/pagged?page=' + page + '&quantity=' + quantityPerPage + (semFiltro ? '' : '&prova=' + filtroNome))
        .then((response) => {
            if(response.data.success){
                setProvas(response.data.object);
                setQuantity(response.data.total);
                setLoadding(false);
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar');
        })
    }

    useEffect(() => {
        setLoadding(true);

        buscaProvas(page);
    }, []);

    function abrirQuestao(codigo){
        navigate('/listagemquestoes/' + codigo, {replace: true});
    }

    function filtrar(){
        closeModal();
        setLoadding(true);
        setPage(1);
        buscaProvas(1);
    }

    function limparFiltro(){
        closeModal();
        setFiltroNome('');
        setLoadding(true);
        setPage(1);
        buscaProvas(1, true);
    }

    const handleChange = (event, value) => {
        setPage(value);
        setLoadding(true);
        buscaProvas(value);
      };

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

    function addProva(){
        navigate('/cadastroProva', {replace: true});
    }
    
    return(
        <div className='containerpage'>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Filtros</h3>
                    </div>
                    <div className='filtros'>
                        <br/>
                        <h4>
                            Prova:
                            <input type='text' value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)}/>
                        </h4>
                    </div>
                    <div className='botoesModalFiltro'>
                        <button onClick={limparFiltro}>Limpar</button>
                        <button onClick={filtrar}>Filtrar</button>
                    </div>
                </div>
            </Modal>
            <div className='opcoesProva'>
                <h2><a onClick={limparFiltro}>Provas</a></h2>
                <div className='opcaoFiltro'>
                    {
                        localStorage.getItem(Config.ADMIN) == '1' ?
                        <h2><BsFileEarmarkPlusFill onClick={addProva}/></h2>
                        :
                        <></>
                    }
                    <h2><BsFunnelFill onClick={openModal}/></h2>
                </div>
            </div>
            <div className='provas'>
                {
                    provas.map((item) => {
                        return(
                            <div key={item.id}>
                                <h4>
                                <div className='tituloProva'>
                                    <b>📚{item.nomeProva}📚</b> 
                                </div>
                                <br/>
                                <b>Tipo:</b> {item.tipoProva}
                                <br/>
                                <b>Local de aplicação:</b> {item.local}
                                <br/>
                                <b>Banca:</b> {item.banca}
                                <br/>
                                <b>Data de aplicação:</b> {item.dataAplicacao}
                                <br/>
                                <b>Quantidade de questões:</b> {item.quantidadeQuestoesTotal}🔥
                                {
                                    <>
                                    <br/>
                                    <b>Quantidade de questões resolvidas:</b> {item.quantidadeQuestoesResolvidas}✅
                                    <br/>
                                    <b>Progresso:</b>
                                    <br/>
                                    <LinearProgressWithLabel value={parseInt((item.quantidadeQuestoesResolvidas/item.quantidadeQuestoesTotal) * 100)} />
                                    </>
                                }
                                <br/>
                                {
                                    /*item.linkProva ?
                                    <a className='botaoBaixarArquivo' target="_blank" href={item.linkProva}><CloudDownloadIcon/> Prova</a>
                                    :<></>
                                }
                                <br/>
                                {
                                    item.linkGabarito ?
                                    <a className='botaoBaixarArquivo' target="_blank" href={item.linkGabarito}><CloudDownloadIcon/> Gabarito</a>
                                    :<></>*/
                                }
                                </h4>
                                <button onClick={() => abrirQuestao(item.id)}>Visualizar questão✏️</button>
                                <br/>
                                <br/>
                            </div>
                        )
                    })
                }
                {
                    quantity > 0 ?
                    <Stack spacing={4}>
                        <Pagination count={parseInt((quantity/quantityPerPage)+1)} page={page} color="primary" showFirstButton showLastButton onChange={handleChange}/>
                    </Stack>    
                    :
                    <>
                    </>
                }
                
            </div>
        </div>
    )
}

export default ListagemProvas;