import './style.css';
import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import Config from '../../config.json';
import { BsFileEarmarkPlusFill } from 'react-icons/bs';
import Modal from 'react-modal';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';
import { customStyles, MontaFiltrosLocalSession } from '../../services/functions.js';
import FilterComponent from '../../components/FilterComponent/index.js';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader.js';
import { useAuth } from '../../auth/useAuth';
import { Roles } from '../../auth/roles';
import { requireRole } from '../../auth/requireRole';

function ListagemProvas() {
    const style = customStyles();
    const { filtro } = useParams();
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [provas, setProvas] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(filtro);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(7);
    const searchParams = new URLSearchParams(window.location.search);
    const [isSimulado] = useState(searchParams.get('tipo') === 'simulado');
    const { role, isAuthenticated } = useAuth();
    const isAdmin = requireRole(role, [Roles.Admin]);
    const selectedTipos = JSON.parse(localStorage.getItem(Config.filtroTiposSelecionados) || '[]');

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function redirectToLogin(returnUrl) {
        navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
    }

    async function buscaProvas(nextPage) {
        const endpoint = isAuthenticated
            ? '/Prova/pagged?page=' + nextPage + '&quantity=' + quantityPerPage + MontaFiltrosLocalSession()
            : '/PublicQuestoes/provas-pagged?page=' + nextPage + '&quantity=' + quantityPerPage + MontaFiltrosLocalSession();

        await api.get(endpoint)
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
            });
    }

    useEffect(() => {
        setLoadding(true);
        buscaProvas(page);
    }, []);

    function abrirQuestao(codigo) {
        navigate('/listagemquestoes/' + codigo, { replace: true });
    }

    function abrirSimulado(codigo) {
        const returnUrl = '/questoes/simulado&' + codigo + '?codigoProva=' + codigo + '&page=1';

        if (!isAuthenticated) {
            redirectToLogin(returnUrl);
            return;
        }

        navigate(returnUrl, { replace: true });
    }

    function filtrar() {
        closeModal();
        setLoadding(true);
        setPage(1);
        buscaProvas(1);
    }

    const handleChange = (event, value) => {
        localStorage.setItem(Config.PaginaListagem, value);
        navigate('/listagemprovas/' + value, { replace: true });
        setPage(value);
        setLoadding(true);
        buscaProvas(value);
    };

    function addProva() {
        navigate('/cadastroProva', { replace: true });
    }

    async function baixarArquivo(codigo, nome, prova) {
        setLoadding(true);
        const url = (prova ? '/Prova/downloadProva?codigo=' : '/Prova/downloadGabarito?codigo=') + codigo;

        await api.get(url)
            .then((response) => {
                setLoadding(false);
                if (response.data.success) {
                    const link = document.createElement('a');
                    link.href = response.data.object;
                    link.download = (prova ? 'Prova ' : 'Gabarito ') + nome.replace('/', '').replace('-', ' ') + '.html';
                    link.click();
                }
                else {
                    toast.error((prova ? 'Prova' : 'Gabarito') + ' não encontrada');
                }
            })
            .catch(() => {
                setLoadding(false);
                toast.error('Erro ao gerar a prova!');
            });
    }

    async function AtualizaStatus(id, status) {
        setLoadding(true);
        const url = '/Prova/updateStatus?id=' + id + '&active=' + (status === '0' ? 'true' : 'false');

        await api.put(url)
            .then((response) => {
                setLoadding(false);
                if (response.data.success) {
                    toast.success('Atualizado com sucesso!');
                    buscaProvas(page);
                }
                else {
                    toast.error('Não foi possível atualizar');
                }
            })
            .catch(() => {
                setLoadding(false);
                toast.error('Não foi possível atualizar');
            });
    }

    if (loadding) {
        return <PacmanLoader />;
    }

    return (
        <div className='global-pageContainer'>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={style}
                contentLabel='Filtro'
            >
                <FilterComponent buscaQuestoesFiltrando={filtrar} setFiltro={() => {}} showMaterias={false} showAssuntos={false} />
            </Modal>
            <div className='opcoesProva'>
                <h3 className='provaTitle'><a>Provas {selectedTipos.length > 0 ? selectedTipos[0].label : ''}</a></h3>
                <div className='opcaoFiltro'>
                    {isAdmin && !isSimulado ? <h2><BsFileEarmarkPlusFill onClick={addProva} /></h2> : <></>}
                    <h3 className='link'><button className='global-button global-button--transparent' onClick={openModal}>Filtrar</button></h3>
                </div>
            </div>
            <div className='provas'>
                {provas.map((item) => (
                    <div className='global-infoPanel' key={item.Id}>
                        <h4>
                            <div className='tituloProva'>
                                <b>📚{item.nomeProva}📚{isAdmin ? <a onClick={() => navigate('/cadastroProva/' + item.Id, { replace: true })}>✏️</a> : <></>}</b>
                                <sub><b>{item.tipoProvaAssociado?.map((t, index) => (index === 0 ? t.tipoProva.descricao : ' | ' + t.tipoProva.descricao))}</b></sub>
                            </div>
                            <br />
                            {isAdmin ? <>Status: <b>{item.isActive === '1' ? 'ATIVO' : 'DESATIVADO'}</b></> : <></>}
                            <br />
                            <b>Tipo:</b> {item.tipoProva}
                            <br />
                            <b>Local de aplicação:</b> {item.local}
                            <br />
                            <b>Banca:</b> {item.banca}
                            <br />
                            <b>Data de aplicação:</b> {item.dataAplicacao}
                            <br />
                            <b className='clickOption' onClick={() => baixarArquivo(item.Id, item.nomeProva, true)}>Baixar Prova 🔽</b>
                            <br />
                            {
                                !isSimulado && isAuthenticated
                                    ? <><b className='clickOption' onClick={() => baixarArquivo(item.Id, item.nomeProva, false)}>Baixar Gabarito 🔽</b><br /></>
                                    : !isSimulado
                                        ? <><b className='clickOption' onClick={() => redirectToLogin('/listagemprovas/' + page)}>Entrar para ver gabarito</b><br /></>
                                        : <></>
                            }
                            <br />
                            <b>Quantidade de questões:</b> {item.quantidadeQuestoesTotal}🔥
                            {!isSimulado ? <><br /><b>Quantidade de questões resolvidas:</b> {item.quantidadeQuestoesResolvidas || 0}✅<br /><b>Progresso:</b><br />
                                <LinearProgressWithLabel sx={{
                                    backgroundColor: Config.pallete[0],
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#8A2BE2',
                                    },
                                }} value={parseInt(((item.quantidadeQuestoesResolvidas || 0) / (item.quantidadeQuestoesTotal || 1)) * 100)} />
                            </> : <></>}
                            <br />
                        </h4>
                        <div className='global-buttonWrapper'>
                            {!isSimulado ? <>
                                {isAdmin ? <button className='global-button global-button--transparent global-button--full-width' onClick={() => AtualizaStatus(item.Id, item.isActive)}>{item.isActive === '1' ? 'DESATIVAR' : 'ATIVAR'}</button> : <></>}
                                <button className='global-button global-button--transparent global-button--full-width' onClick={() => abrirQuestao(item.Id)}>Visualizar questões</button>
                                <button className='global-button global-button--transparent global-button--full-width' onClick={() => abrirSimulado(item.Id)}>{isAuthenticated ? 'Iniciar Simulado' : 'Entrar para responder'}</button>
                            </> : <>
                                <button className='global-button global-button--transparent global-button--full-width' onClick={() => abrirSimulado(item.Id)}>{isAuthenticated ? 'Iniciar Simulado' : 'Entrar para responder'}</button>
                            </>}
                        </div>
                    </div>
                ))}
            </div>
            <div className='itensPaginacao global-mt'>
                {quantity > 0 ? <Stack spacing={4}>
                    <Pagination
                        sx={{
                            '& .Mui-selected': { color: 'white' },
                            '& .MuiPaginationItem-root': { color: 'white' },
                        }}
                        count={Math.ceil(quantity / quantityPerPage)}
                        page={parseInt(page)}
                        color='primary'
                        showFirstButton
                        showLastButton
                        onChange={handleChange}
                    />
                </Stack> : <></>}
            </div>
        </div>
    );
}

export default ListagemProvas;

