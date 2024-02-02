import './style.css';
import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-toastify';
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

function ListagemProvas() {
    const { filtro } = useParams();
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [provas, setProvas] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [filtroNome, setFiltroNome] = useState('');
    const [page, setPage] = useState(filtro);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(7);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    async function buscaProvas(page, semFiltro) {
        if (!localStorage.getItem(Config.TOKEN)) {
            toast.info('Necessário logar para acessar!');
            navigate('/', { replace: true });
            return;
        }

        var tipo = localStorage.getItem(Config.FiltroProva) == 'Todas as provas' ? '' : localStorage.getItem(Config.FiltroProva);

        tipo = tipo == '' ? '' : '&tipo=' + tipo;

        await api.get('/Prova/pagged?page=' + page + '&quantity=' + quantityPerPage + tipo + (semFiltro ? '' : '&prova=' + filtroNome))
            .then((response) => {
                if (response.data.success) {
                    setProvas(response.data.object);
                    setQuantity(response.data.total);
                    setLoadding(false);
                }
                else {
                    navigate('/', { replace: true });
                    toast.warn('Erro ao buscar');
                }
            })
            .catch(() => {
                navigate('/', { replace: true });
                toast.warn('Erro ao buscar');
            })
    }

    useEffect(() => {
        setLoadding(true);

        buscaProvas(page, true);
    }, []);

    function abrirQuestao(codigo) {
        navigate('/listagemquestoes/' + codigo, { replace: true });
    }

    function abrirSimulado(codigo) {
        navigate('/questoes/simulado&' + codigo, { replace: true });
    }

    function filtrar() {
        closeModal();
        setLoadding(true);
        setPage(1);
        buscaProvas(1);
    }

    function limparFiltro() {
        closeModal();
        setFiltroNome('');
        setLoadding(true);
        setPage(1);
        buscaProvas(1, true);
    }

    const handleChange = (event, value) => {
        localStorage.setItem(Config.PaginaListagem, value);
        navigate('/listagemprovas/' + value, { replace: true });
        setPage(value);
        setLoadding(true);
        buscaProvas(value);
    };

    if (loadding) {
        return (
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    function addProva() {
        navigate('/cadastroProva', { replace: true });
    }

    async function baixarArquivo(codigo, nome, prova){
        setLoadding(true);
        let url = prova ? '/Prova/downloadProva?codigo=' : '/Prova/downloadGabarito?codigo=';
        url += codigo;

        await api.get(url)
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                const link = document.createElement('a');
                link.href = response.data.object;
                link.download = (prova ? 'Prova ' : 'Gabarito ') + nome.replace('/', '').replace('-', ' ') + '.html';
                link.click();
            }
            else{
                toast.error((prova ? 'Prova' : 'Gabarito') + ' não encontrada');
            }
        })
        .catch((error) => {
            setLoadding(false);
            console.log(error);
            toast.error('Erro ao gerar a prova!');
        })
    }

    async function AtualizaStatus(id, status){
        setLoadding(true);
        let url = '/Prova/updateStatus?id=' +  id + '&active=' + (status == '0' ? 'true' : 'false');

        await api.put(url)
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                toast.success('Atualizado com sucesso!');
                buscaProvas(page);
            }
            else{
                toast.error('Não foi possível atualizar');
            }
        })
        .catch((error) => {
            setLoadding(false);
            console.log(error);
            toast.error('Não foi possível atualizar');
        })
    }

    return (
        <div className='global-pageContainer'>
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
                    <div className="separator separator--withMargins"></div>
                    <div className='filtrosProva'>
                        <h4>
                            Nome da prova:
                        </h4>
                        <input type='text' value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
                    </div>
                    <div className='botoesModalFiltro'>
                        <button className='global-button global-button--transparent' onClick={limparFiltro}>Limpar</button>
                        <button className='global-button' onClick={filtrar}>Filtrar</button>
                    </div>
                </div>
            </Modal>
            <div className='opcoesProva'>
                <h2 className='provaTitle'><a onClick={limparFiltro}>Provas {localStorage.getItem(Config.FiltroProva)}</a></h2>
                <div className='opcaoFiltro'>
                    {
                        localStorage.getItem(Config.ADMIN) == '1' ?
                            <h2><BsFileEarmarkPlusFill onClick={addProva} /></h2>
                            :
                            <></>
                    }
                    <h2><BsFunnelFill onClick={openModal} /></h2>
                </div>
            </div>
            <div className='provas'>
                {
                    provas.map((item) => {
                        return (
                            <div className='global-infoPanel' key={item.id}>
                                <h4>
                                    <div className='tituloProva'>
                                        <b>📚{item.nomeProva}📚{localStorage.getItem(Config.ADMIN) == '1' ? <a onClick={() => navigate('/cadastroProva/' + item.id, { replace: true })}>✏️</a> : <></>}</b>
                                        <sub><b>{
                                            item.tipoProvaAssociado.map((t, index) => {
                                                return (
                                                    <>
                                                        {index == 0 ? t.tipoProva.descricao : ' | ' + t.tipoProva.descricao}
                                                    </>
                                                )
                                            })}</b></sub>
                                    </div>
                                    <br />
                                    {
                                        localStorage.getItem(Config.ADMIN) == '1' ?
                                            <>
                                                Status: <b>{item.isActive == '1' ? 'ATIVO' : 'DESATIVADO'}</b>
                                            </>
                                            :
                                            <></>
                                    }
                                    <br />
                                    <b>Tipo:</b> {item.tipoProva}
                                    <br />
                                    <b>Local de aplicação:</b> {item.local}
                                    <br />
                                    <b>Banca:</b> {item.banca}
                                    <br />
                                    <b>Data de aplicação:</b> {item.dataAplicacao}
                                    <br />
                                    <b className='clickOption' onClick={() => baixarArquivo(item.id, item.nomeProva, true)}>Baixar Prova 🔽</b> 
                                    <br />
                                    <b className='clickOption' onClick={() => baixarArquivo(item.id, item.nomeProva, false)}>Baixar Gabarito 🔽</b> 
                                    <br />
                                    <br />
                                    <b>Quantidade de questões:</b> {item.quantidadeQuestoesTotal}🔥
                                    {
                                        <>
                                            <br />
                                            <b>Quantidade de questões resolvidas:</b> {item.quantidadeQuestoesResolvidas}✅
                                            <br />
                                            <b>Progresso:</b>
                                            <br />
                                            <LinearProgressWithLabel sx={{
                                                backgroundColor: '#4B0082',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#8A2BE2'
                                                }
                                            }} value={parseInt((item.quantidadeQuestoesResolvidas / item.quantidadeQuestoesTotal) * 100)} />
                                        </>
                                    }
                                    <br />
                                </h4>
                                <div className='global-buttonWrapper'>
                                    {
                                        localStorage.getItem(Config.ADMIN) == '1' ?
                                            <>
                                                <button className='global-button global-button--transparent global-button--full-width' onClick={() => AtualizaStatus(item.id, item.isActive)}>{item.isActive == '1' ? 'DESATIVAR' : 'ATIVAR'}</button>
                                            </>
                                            :
                                            <></>
                                    }
                                    <button className='global-button global-button--full-width' onClick={() => abrirQuestao(item.id)}>Visualizar questões</button>
                                    <button className='global-button global-button--transparent global-button--full-width' onClick={() => abrirSimulado(item.id)}>Iniciar Simulado</button></div>
                                <br />
                                <br />
                                <br />
                            </div>
                        )
                    })
                }
            </div>
            <div className='itensPaginacao global-mt'>
                {
                    quantity > 0 ?
                        <Stack spacing={4}>
                            <Pagination sx={{
                    '& .Mui-selected': {
                        color: 'white'},
                    '& .MuiPaginationItem-root': {
                        color: 'white',
                  
                  }}} count={parseInt(Math.ceil(quantity / quantityPerPage))} page={parseInt(page)} color="primary" showFirstButton showLastButton onChange={handleChange} />
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