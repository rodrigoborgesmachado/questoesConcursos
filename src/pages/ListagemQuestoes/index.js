import './style.css';
import { useEffect, useMemo, useState } from 'react';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../services/api.js';
import { useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BsFileEarmarkPlusFill } from 'react-icons/bs';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Modal from 'react-modal';
import FilterComponent from '../../components/FilterComponent/index.js';
import { customStyles } from '../../services/functions.js';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader.js';
import { useAuth } from '../../auth/useAuth';
import { Roles } from '../../auth/roles';
import { requireRole } from '../../auth/requireRole';
import {
    buildApiFilterQuery,
    decodeReturnTo,
    getCurrentUrl,
    getFiltersFromSearchParams,
    getPageFromSearchParams,
    mergeFiltersIntoSearchParams,
} from '../../services/listingQueryState.js';

function ListagemQuestoes() {
    const style = customStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [loadding, setLoadding] = useState(true);
    const { filtro } = useParams();
    const [questoes, setQuestoes] = useState([]);
    const [prova, setProva] = useState({});
    const [page, setPage] = useState(getPageFromSearchParams(searchParams, 1));
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(10);
    const [modalFiltroIsOpen, setModalFiltroIsOpen] = useState(false);
    const [filters, setFilters] = useState(getFiltersFromSearchParams(searchParams));

    const { role, isAuthenticated } = useAuth();
    const isAdmin = requireRole(role, [Roles.Admin]);

    const returnTo = searchParams.get('returnTo');
    const apiFilters = useMemo(() => buildApiFilterQuery(filters), [filters]);

    useEffect(() => {
        if (!searchParams.get('page')) {
            const next = new URLSearchParams(searchParams);
            next.set('page', '1');
            setSearchParams(next, { replace: true });
        }
    }, []);

    useEffect(() => {
        setPage(getPageFromSearchParams(searchParams, 1));
        setFilters(getFiltersFromSearchParams(searchParams));
    }, [searchParams]);

    function getCurrentListUrl() {
        return getCurrentUrl(location.pathname, searchParams);
    }

    function redirectToLogin(returnUrl) {
        navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
    }

    function buildResponderUrl(codigoQuestao, index) {
        const baseRoute = filtro ? '/questoes/codigoquestaolistagem:?codigoProva=' + filtro : '/questoes/codigoquestaolistagemsemprova?1=1';
        const listIndex = (quantityPerPage * (page - 1) + (index + 1));
        const currentUrl = encodeURIComponent(getCurrentListUrl());
        const filterQuery = filtro ? '' : apiFilters;

        return `${baseRoute}&id=${codigoQuestao}&pageListagem=${page}&page=${listIndex}${filterQuery}&returnTo=${currentUrl}`;
    }

    function openModalFiltro() {
        setModalFiltroIsOpen(true);
    }

    function closeModalFiltro() {
        setModalFiltroIsOpen(false);
    }

    function persistListState(nextPage, nextFilters) {
        let next = new URLSearchParams(searchParams);
        next = mergeFiltersIntoSearchParams(next, nextFilters);
        next.set('page', String(nextPage));

        if (returnTo) {
            next.set('returnTo', returnTo);
        }

        setSearchParams(next, { replace: true });
    }

    async function buscaProva() {
        const endpoint = isAuthenticated
            ? (filtro ? `/Prova/getById?id=${filtro}` : '/Prova/getById?id=-1')
            : (filtro ? `/PublicQuestoes/prova-by-id?id=${filtro}` : '/PublicQuestoes/prova-by-id?id=-1');

        await api.get(endpoint)
            .then((response) => {
                if (response.data.success) {
                    setProva(response.data.object);
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

    async function buscaQuestoes(nextPage) {
        setLoadding(true);

        const endpoint = isAuthenticated
            ? `/Questoes/pagged?page=${nextPage}&quantity=${quantityPerPage}&anexos=false` + (filtro ? `&codigoProva=${filtro}` : apiFilters)
            : `/PublicQuestoes/questoes-pagged?page=${nextPage}&quantity=${quantityPerPage}&anexos=false` + (filtro ? `&codigoProva=${filtro}` : apiFilters);

        await api.get(endpoint)
            .then((response) => {
                if (response.data.success) {
                    if (filtro) {
                        setQuestoes(response.data.object.sort((a, b) => parseInt(a.numeroQuestao, 10) - parseInt(b.numeroQuestao, 10)));
                    }
                    else {
                        setQuestoes(response.data.object);
                    }

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
        async function load() {
            if (filtro) {
                await buscaProva();
            }

            await buscaQuestoes(page);
        }

        load();
    }, [filtro, page, apiFilters, isAuthenticated]);

    function buscaQuestoesFiltrando(nextFilters) {
        setPage(1);
        setFilters(nextFilters);
        persistListState(1, nextFilters);
        closeModalFiltro();
    }

    function abreQuestao(codigoQuestao, index) {
        if (!isAuthenticated) {
            navigate('/questaopublica/' + codigoQuestao, { replace: true });
            return;
        }

        navigate(buildResponderUrl(codigoQuestao, index), { replace: true });
    }

    function entrarParaResponder(codigoQuestao, index) {
        redirectToLogin(buildResponderUrl(codigoQuestao, index));
    }

    function editaQuestao(codigoQuestao) {
        navigate('/cadastraQuestao/' + filtro + '/1/' + codigoQuestao, { replace: true });
    }

    function addQuestao() {
        let proximoNumero = 1;

        if (questoes.length > 1) {
            proximoNumero = questoes[questoes?.length - 1].numeroQuestao + 1;
        }

        navigate('/cadastraQuestao/' + filtro + '/' + proximoNumero, { replace: true });
    }

    function voltarListagemProva() {
        navigate(decodeReturnTo(returnTo, '/listagemprovas?page=1'), { replace: true });
    }

    const handleChange = (event, value) => {
        setLoadding(true);
        setPage(value);
        persistListState(value, filters);
    };

    async function AtualizaStatus(id, status) {
        setLoadding(true);
        const url = '/Prova/updateStatus?id=' + id + '&active=' + (status === '0' ? 'true' : 'false');

        await api.put(url)
            .then((response) => {
                setLoadding(false);
                if (response.data.success) {
                    toast.success('Atualizado com sucesso!');
                    buscaProva();
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
        <div className='global-pageContainer-left'>
            <Modal
                isOpen={modalFiltroIsOpen}
                onRequestClose={closeModalFiltro}
                style={style}
                contentLabel='Filtro'
            >
                <FilterComponent
                    buscaQuestoesFiltrando={buscaQuestoesFiltrando}
                    setFiltro={() => {}}
                    filters={filters}
                    onApply={buscaQuestoesFiltrando}
                    persistInLocalStorage={false}
                />
            </Modal>
            {filtro
                ? <>
                    <div className='total'>
                        <button className='global-button global-button--secondary' onClick={voltarListagemProva}>Voltar</button>
                    </div>
                    <h3 className='nomeProvaDescricao'>
                        Prova: {prova?.nomeProva}
                        <br />
                        Banca: {prova?.banca}
                        <br />
                        Tipo: {prova?.tipoProva}
                        <br />
                        Ano: {prova?.dataAplicacao}
                        <br />
                        Local: {prova?.local}
                        <br />
                        {isAdmin ? <>Status: <b>{prova?.isActive === '1' ? 'ATIVO' : 'DESATIVADO'}</b></> : <></>}
                    </h3>
                </>
                : <></>}
            <div className='opcoesQuestoes'>
                {isAdmin && filtro ? <button className={`global-button global-button--full-width ${prova?.isActive === '1' ? 'global-button--danger' : 'global-button--success'}`} onClick={() => AtualizaStatus(prova?.Id, prova?.isActive)}>{prova?.isActive === '1' ? 'DESATIVAR' : 'ATIVAR'}</button> : <></>}
                <div className='opcaoFiltro'>
                    {isAdmin && filtro ? <h3 onClick={addQuestao}><BsFileEarmarkPlusFill /> Adicionar</h3> : <></>}
                </div>
            </div>
            {!filtro
                ? <div className='opcoes-top-tabela'>
                    <h3>Questões (Total: {quantity})</h3>
                    <h3 className='link'><button className='global-button global-button--secondary' onClick={openModalFiltro}>Filtrar</button></h3>
                </div>
                : <div>
                    <h3>Questões (Total: {quantity})</h3>
                </div>}
            <div className='global-fullW'>
                <Table className='global-table'>
                    <thead>
                        <tr>
                            {!filtro && isAdmin ? <th>Código</th> : <></>}
                            <th><h4>Nº Questão</h4></th>
                            <th><h4>Matéria</h4></th>
                            <th><h4>Assunto</h4></th>
                            {!filtro ? <th>Prova</th> : <></>}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {questoes.map((item, index) => (
                            <tr key={item.Id}>
                                {!filtro && isAdmin
                                    ? <td className='option'>
                                        {isAdmin ? <h4 onClick={() => editaQuestao(item.Id)}>✏️{item.Id}</h4> : <h4 onClick={() => abreQuestao(item.Id, index)}>✏️{item.Id}</h4>}
                                    </td>
                                    : <></>}
                                <td className='option'>
                                    <span className='questao-link'>
                                        {isAdmin ? <h4 onClick={() => editaQuestao(item.Id)}>✏️{item.numeroQuestao}</h4> : <h4 onClick={() => abreQuestao(item.Id, index)}>✏️{item.numeroQuestao}</h4>}
                                    </span>
                                </td>
                                <td><h4 onClick={() => abreQuestao(item.Id, index)}>{item.materia}</h4></td>
                                <td><h4 onClick={() => abreQuestao(item.Id, index)}>{item.assunto}</h4></td>
                                {!filtro ? <td>{item.prova?.nomeProva}</td> : <></>}
                                <td>
                                    {!isAuthenticated
                                        ? <button className='global-button global-button--secondary global-button--full-width' onClick={() => entrarParaResponder(item.Id, index)}>Entrar para responder</button>
                                        : item?.respostasUsuarios?.find((element) => item?.respostasQuestoes?.find((elem) => elem.codigo === element.codigoResposta && elem.certa === '1')) !== undefined
                                            ? <button className='global-button global-button--success global-button--full-width' onClick={() => abreQuestao(item.Id, index)}>Respondida</button>
                                            : <>
                                                {item?.respostasUsuarios?.find((element) => item?.respostasQuestoes?.find((elem) => elem.codigo === element.codigoResposta && elem.certa === '0')) !== undefined
                                                    ? <button className='global-button global-button--danger global-button--full-width' onClick={() => abreQuestao(item.Id, index)}>Responder</button>
                                                    : <button className='global-button global-button--full-width' onClick={() => abreQuestao(item.Id, index)}>Responder</button>}
                                            </>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className='itensPaginacao global-mt'>
                {quantity > 0
                    ? <Stack spacing={4}>
                        <Pagination
                            sx={{
                                '& .Mui-selected': {
                                    color: 'var(--pagination-item-color)',
                                },
                                '& .MuiPaginationItem-root': {
                                    color: 'var(--pagination-item-color)',
                                },
                            }}
                            count={Math.ceil(quantity / quantityPerPage)}
                            page={parseInt(page, 10)}
                            color='primary'
                            showFirstButton
                            showLastButton
                            onChange={handleChange}
                        />
                    </Stack>
                    : <></>}
            </div>

        </div>
    );
}

export default ListagemQuestoes;
