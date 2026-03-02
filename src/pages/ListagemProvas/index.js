import './style.css';
import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BsFileEarmarkPlusFill } from 'react-icons/bs';
import Modal from 'react-modal';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';
import { customStyles } from '../../services/functions.js';
import FilterComponent from '../../components/FilterComponent/index.js';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader.js';
import { useAuth } from '../../auth/useAuth';
import { Roles } from '../../auth/roles';
import { requireRole } from '../../auth/requireRole';
import {
    buildApiFilterQuery,
    getCurrentUrl,
    getFiltersFromSearchParams,
    getPageFromSearchParams,
    mergeFiltersIntoSearchParams,
} from '../../services/listingQueryState.js';

function ListagemProvas() {
    const style = customStyles();
    const { filtro } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const fallbackPage = Number.isNaN(parseInt(filtro, 10)) ? 1 : parseInt(filtro, 10);

    const [loadding, setLoadding] = useState(true);
    const [provas, setProvas] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(getPageFromSearchParams(searchParams, fallbackPage));
    const [filters, setFilters] = useState(getFiltersFromSearchParams(searchParams));
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(7);

    const isSimulado = searchParams.get('tipo') === 'simulado';
    const selectedTipos = filters?.tipos || [];

    const { role, isAuthenticated } = useAuth();
    const isAdmin = requireRole(role, [Roles.Admin]);

    const apiFilters = useMemo(() => buildApiFilterQuery(filters), [filters]);

    useEffect(() => {
        if (!searchParams.get('page')) {
            const next = mergeFiltersIntoSearchParams(searchParams, getFiltersFromSearchParams(searchParams));
            next.set('page', String(fallbackPage));

            if (isSimulado) {
                next.set('tipo', 'simulado');
            }

            setSearchParams(next, { replace: true });
        }
    }, []);

    useEffect(() => {
        setPage(getPageFromSearchParams(searchParams, fallbackPage));
        setFilters(getFiltersFromSearchParams(searchParams));
    }, [searchParams, fallbackPage]);

    async function buscaProvas(nextPage, nextFiltersQuery) {
        const endpoint = isAuthenticated
            ? `/Prova/pagged?page=${nextPage}&quantity=${quantityPerPage}${nextFiltersQuery}`
            : `/PublicQuestoes/provas-pagged?page=${nextPage}&quantity=${quantityPerPage}${nextFiltersQuery}`;

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
        buscaProvas(page, apiFilters);
    }, [page, apiFilters, isAuthenticated]);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function persistListState(nextPage, nextFilters) {
        let next = new URLSearchParams(searchParams);
        next = mergeFiltersIntoSearchParams(next, nextFilters);
        next.set('page', String(nextPage));

        if (isSimulado) {
            next.set('tipo', 'simulado');
        }

        setSearchParams(next, { replace: true });
    }

    function redirectToLogin(returnUrl) {
        navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
    }

    function getCurrentListUrl() {
        return getCurrentUrl(location.pathname, searchParams);
    }

    function abrirQuestao(codigo) {
        const returnTo = encodeURIComponent(getCurrentListUrl());
        navigate(`/listagemquestoes/${codigo}?page=1&returnTo=${returnTo}`, { replace: true });
    }

    function abrirSimulado(codigo) {
        const returnUrl = `/questoes/simulado&${codigo}?codigoProva=${codigo}&page=1`;

        if (!isAuthenticated) {
            redirectToLogin(returnUrl);
            return;
        }

        navigate(returnUrl, { replace: true });
    }

    function filtrar(nextFilters) {
        closeModal();
        setLoadding(true);
        setFilters(nextFilters);
        setPage(1);
        persistListState(1, nextFilters);
    }

    const handleChange = (event, value) => {
        setLoadding(true);
        setPage(value);
        persistListState(value, filters);
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
                    buscaProvas(page, apiFilters);
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
                <FilterComponent
                    buscaQuestoesFiltrando={filtrar}
                    setFiltro={() => {}}
                    showMaterias={false}
                    showAssuntos={false}
                    filters={filters}
                    onApply={filtrar}
                    persistInLocalStorage={false}
                />
            </Modal>
            <div className='opcoesProva'>
                <h3 className='provaTitle'>Provas {selectedTipos.length > 0 ? selectedTipos[0] : ''}</h3>
                <div className='opcaoFiltro'>
                    {isAdmin && !isSimulado ? <h2><BsFileEarmarkPlusFill onClick={addProva} /></h2> : <></>}
                    <h3 className='link'><button className='global-button global-button--secondary' onClick={openModal}>Filtrar</button></h3>
                </div>
            </div>
            <div className='provas'>
                {provas.map((item) => (
                    <div className='global-infoPanel global-infoPanel--subtle' key={item.Id}>
                        <h4>
                            <div className='tituloProva'>
                                <b>
                                    📚{item.nomeProva}📚
                                    {isAdmin ? <button className='link-icon-button' onClick={() => navigate('/cadastroProva/' + item.Id, { replace: true })} aria-label='Editar prova'>✏️</button> : <></>}
                                </b>
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
                                        ? <><b className='clickOption' onClick={() => redirectToLogin(getCurrentListUrl())}>Entrar para ver gabarito</b><br /></>
                                        : <></>
                            }
                            <br />
                            <b>Quantidade de questões:</b> {item.quantidadeQuestoesTotal}🔥
                            {!isSimulado ? <><br /><b>Quantidade de questões resolvidas:</b> {item.quantidadeQuestoesResolvidas || 0}✅<br /><b>Progresso:</b><br />
                                <LinearProgressWithLabel sx={{
                                    backgroundColor: 'var(--progress-track-color)',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: 'var(--progress-bar-color)',
                                    },
                                }} value={parseInt(((item.quantidadeQuestoesResolvidas || 0) / (item.quantidadeQuestoesTotal || 1)) * 100, 10)} />
                            </> : <></>}
                            <br />
                        </h4>
                        <div className='global-buttonWrapper'>
                            {!isSimulado ? <>
                                {isAdmin ? <button className={`global-button global-button--full-width ${item.isActive === '1' ? 'global-button--danger' : 'global-button--success'}`} onClick={() => AtualizaStatus(item.Id, item.isActive)}>{item.isActive === '1' ? 'DESATIVAR' : 'ATIVAR'}</button> : <></>}
                                <button className='global-button global-button--secondary global-button--full-width' onClick={() => abrirQuestao(item.Id)}>Visualizar questões</button>
                                <button className='global-button global-button--full-width' onClick={() => abrirSimulado(item.Id)}>{isAuthenticated ? 'Iniciar Simulado' : 'Entrar para responder'}</button>
                            </> : <>
                                <button className='global-button global-button--full-width' onClick={() => abrirSimulado(item.Id)}>{isAuthenticated ? 'Iniciar Simulado' : 'Entrar para responder'}</button>
                            </>}
                        </div>
                    </div>
                ))}
            </div>
            <div className='itensPaginacao global-mt'>
                {quantity > 0 ? <Stack spacing={4}>
                    <Pagination
                        sx={{
                            '& .Mui-selected': { color: 'var(--pagination-item-color)' },
                            '& .MuiPaginationItem-root': { color: 'var(--pagination-item-color)' },
                        }}
                        count={Math.ceil(quantity / quantityPerPage)}
                        page={parseInt(page, 10)}
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
