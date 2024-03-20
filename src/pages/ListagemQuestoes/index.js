import './style.css';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import {toast} from 'react-toastify';
import api from '../../services/api.js';
import { useParams, useNavigate } from 'react-router-dom';
import { BsFileEarmarkPlusFill } from "react-icons/bs";
import Config from './../../config.json';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Modal from 'react-modal';
import FilterComponent from '../../components/FilterComponent/index.js';
import { customStyles, MontaFiltrosLocalSession } from '../../services/functions.js';

function ListagemQuestoes(){
    const style = customStyles();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);

    const[loadding, setLoadding] = useState(true);
    const{filtro} = useParams();
    const[questoes, setQuestoes] = useState([]);
    const[prova, setProva] = useState({});
    const [page, setPage] = useState(searchParams.get('page') ? searchParams.get('page') : 1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(10);
    const [modalFiltroIsOpen, setModalFiltroIsOpen] = useState(false);
    const [filtroMontado, setFiltroMontado] = useState(MontaFiltrosLocalSession());

    async function openModalFiltro() {
        setModalFiltroIsOpen(true);
    }

    function closeModalFiltro() {
        setModalFiltroIsOpen(false);
    }

    async function buscaProva(){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get(filtro ? `/Prova/getById?id=${filtro}` : `/Prova/getById?id=-1`)
        .then((response) => {
            if(response.data.success){
                setProva(response.data.object);
                buscaQuestoes(page);
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

    async function buscaQuestoesFiltrando(){
        setPage(1);
        await buscaQuestoes(1);
        closeModalFiltro();
    }

    async function buscaQuestoes(page){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }
        setLoadding(true);
        
        await api.get(`/Questoes/pagged?page=${page}&quantity=${quantityPerPage}&anexos=false` + (filtro ? `&codigoProva=${filtro}` : MontaFiltrosLocalSession()))
        .then((response) => {
            if(response.data.success){
                if(filtro){
                    setQuestoes(response.data.object.sort((a, b) => parseInt(a.numeroQuestao) - parseInt(b.numeroQuestao)));
                }
                else{
                    setQuestoes(response.data.object);
                }
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

        if(filtro){
            buscaProva();
        }
        else{
            buscaQuestoes(page);
        }
    }, [])

    function abreQuestao(codigoQuestao, index){
        navigate((filtro ? '/questoes/codigoquestaolistagem:?codigoProva=' + filtro : '/questoes/codigoquestaolistagemsemprova?1=1') + '&id=' + codigoQuestao + '&pageListagem=' + page + '&page=' + (quantityPerPage*(page-1) + (index+1)) + '&' + MontaFiltrosLocalSession(), {replace: true});
    }

    function editaQuestao(codigoQuestao){
        navigate('/cadastraQuestao/' + filtro + '/1/' + codigoQuestao, {replace: true});
    }

    function addQuestao(){
        var proximoNumero = 1;

        if(questoes.length > 1)
            proximoNumero = questoes[questoes?.length -1].numeroQuestao + 1;

        navigate('/cadastraQuestao/' + filtro + '/' + proximoNumero, {replace: true});
    }

    function voltarListagemProva(){
        var page = localStorage.getItem(Config.PaginaListagem) == null ? '1' : localStorage.getItem(Config.PaginaListagem);
        navigate('/listagemprovas/' + page, {replace: true});
    }

    const handleChange = (event, value) => {
        setPage(value);
        setLoadding(true);
        buscaQuestoes(value);
    };

    async function AtualizaStatus(id, status){
        setLoadding(true);
        let url = '/Prova/updateStatus?id=' +  id + '&active=' + (status == '0' ? 'true' : 'false');

        await api.put(url)
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                toast.success('Atualizado com sucesso!');
                buscaProva();
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

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className='global-pageContainer-left'>
            <Modal
                isOpen={modalFiltroIsOpen}
                onRequestClose={closeModalFiltro}
                style={style}
                contentLabel="Filtro"
            >
                <FilterComponent buscaQuestoesFiltrando={buscaQuestoesFiltrando} setFiltro={setFiltroMontado}/>
            </Modal>
            {
                filtro ?
                <>
                    <div className='total'>
                        <button className='global-button global-button--transparent' onClick={voltarListagemProva}>Voltar</button>
                    </div>
                    <h3 className='nomeProvaDescricao'>
                        Prova: {prova?.nomeProva} 
                        <br/>
                        Banca: {prova?.banca}
                        <br/>
                        Tipo: {prova?.tipoProva}
                        <br/>
                        Local: {prova?.local}
                        <br />
                        {
                            localStorage.getItem(Config.ADMIN) == '1' ?
                                <>
                                    Status: <b>{prova?.isActive == '1' ? 'ATIVO' : 'DESATIVADO'}</b>
                                </>
                                :
                                <></>
                        }
                    </h3>
                </>
                :
                <></>
            }
            <div className='opcoesQuestoes'>
                {
                    localStorage.getItem(Config.ADMIN) == '1' && filtro ?
                        <>
                            <button className='global-button global-button--transparent global-button--full-width' onClick={() => AtualizaStatus(prova?.id, prova?.isActive)}>{prova?.isActive == '1' ? 'DESATIVAR' : 'ATIVAR'}</button>
                        </>
                        :
                        <></>
                }
                <div className='opcaoFiltro'>
                    {
                        localStorage.getItem(Config.ADMIN) == '1' && filtro ?
                        <h3 onClick={addQuestao}><BsFileEarmarkPlusFill/>  Adicionar</h3>
                        :
                        <></>
                    }
                </div>
            </div>
            {
                !filtro ? 
                <div className='opcoes-top-tabela'>
                    <h3>Questões (Total: {quantity})</h3>
                    <h3 className='link'><button className='global-button global-button--transparent' onClick={openModalFiltro}>Filtrar</button></h3>
                </div>
                :
                <div className=''>
                    <h3>Questões (Total: {quantity})</h3>
                </div>
            }
            <div className='global-fullW'>
            <Table>
                <thead>
                    <tr>
                        {
                            !filtro && localStorage.getItem(Config.ADMIN) === '1' ?
                            <th>
                                Código
                            </th>
                            :<></>
                        }
                        <th>
                            <h4>
                            Nº Questão
                            </h4>
                        </th>
                        <th>
                            <h4>
                            Matéria
                            </h4>
                        </th>
                        <th>
                            <h4>
                                Assunto
                            </h4>
                        </th>
                        {
                            !filtro ?
                            <th>
                                Prova
                            </th>
                            :<></>
                        }
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        questoes.map((item, index) => {
                            return(
                                <tr key={item.id}>
                                    {
                                        !filtro && localStorage.getItem(Config.ADMIN) === '1' ?
                                        <td className='option'>
                                            {
                                                localStorage.getItem(Config.ADMIN) === '1' ?
                                                <h4 onClick={() => editaQuestao(item.id)}>
                                                    ✏️{item.id}
                                                </h4>
                                                :
                                                <h4 onClick={() => abreQuestao(item.id, index)}>
                                                    ✏️{item.id}
                                                </h4>
                                            }
                                        </td>
                                        :<></>
                                    }
                                    <td className='option'>
                                        <a>
                                            {
                                                localStorage.getItem(Config.ADMIN) === '1' ?
                                                <h4 onClick={() => editaQuestao(item.id)}>
                                                    ✏️{item.numeroQuestao}
                                                </h4>
                                                :
                                                <h4 onClick={() => abreQuestao(item.id, index)}>
                                                    ✏️{item.numeroQuestao}
                                                </h4>
                                            }
                                        </a>
                                    </td>
                                    <td>
                                        <h4 onClick={() => abreQuestao(item.id, index)}>
                                        {item.materia}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 onClick={() => abreQuestao(item.id, index)}>
                                        {item.assunto}
                                        </h4>
                                    </td>
                                    {
                                        !filtro ?
                                        <td>
                                            {item.prova?.nomeProva}
                                        </td>
                                        :<></>
                                    }
                                    <td>
                                        {item?.respostasUsuarios?.find(element => item?.respostasQuestoes.find(elem => elem.codigo == element.codigoResposta && elem.certa === "1")) !== undefined ? 
                                        <button className='global-button-right global-button--full-width' onClick={() => abreQuestao(item.id, index)}>Respondida</button>
                                        :
                                        <>
                                        {
                                            item?.respostasUsuarios?.find(element => item?.respostasQuestoes.find(elem => elem.codigo == element.codigoResposta && elem.certa === "0")) !== undefined ? 
                                            <button className='global-button-wrong global-button--full-width' onClick={() => abreQuestao(item.id, index)}>Responder</button>
                                            :
                                            <button className='global-button global-button--full-width' onClick={() => abreQuestao(item.id, index)}>Responder</button>
                                        }
                                        </>
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
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

export default ListagemQuestoes;