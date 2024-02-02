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

function ListagemQuestoes(){
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(true);
    const{filtro} = useParams();
    const[questoes, setQuestoes] = useState([])
    const[prova, setProva] = useState({})
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(10);

    async function buscaProva(){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get(`/Prova/getById?id=${filtro}`)
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

    async function buscaQuestoes(page){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get(filtro != -1 ? `/Questoes/pagged?page=${page}&quantity=${quantityPerPage}&anexos=false&codigoProva=${filtro}` : `/Questoes/pagged?page=${page}&quantity=${quantityPerPage}&anexos=false`)
        .then((response) => {
            if(response.data.success){
                if(filtro!= -1){
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

        if(filtro != -1){
            buscaProva();
        }
        else{
            buscaQuestoes(page);
        }
    }, [loadding])

    function abreQuestao(codigoQuestao){
        navigate('/questoes/codigoquestaolistagem:' + codigoQuestao, {replace: true});
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
            <div className='total'>
                <button className='global-button global-button--transparent' onClick={voltarListagemProva}>Voltar</button>
            </div>
            {
                filtro != -1 ?
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
                :
                <></>
            }
            <div className='opcoesQuestoes'>
                {
                    localStorage.getItem(Config.ADMIN) == '1' ?
                        <>
                            <button className='global-button global-button--transparent global-button--full-width' onClick={() => AtualizaStatus(prova?.id, prova?.isActive)}>{prova?.isActive == '1' ? 'DESATIVAR' : 'ATIVAR'}</button>
                        </>
                        :
                        <></>
                }
                <div className='opcaoFiltro'>
                    {
                        localStorage.getItem(Config.ADMIN) == '1' ?
                        <h3 onClick={addQuestao}><BsFileEarmarkPlusFill/>  Adicionar</h3>
                        :
                        <></>
                    }
                </div>
            </div>
            <div className='global-fullW'>
            <h3>Questões (Total: {quantity})</h3>
            <Table>
                <thead>
                    <tr>
                        {
                            filtro == -1 ?
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
                        {
                            filtro == -1 ?
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
                        questoes.map((item) => {
                            return(
                                <tr key={item.id}>
                                    {
                                        filtro == -1 ?
                                        <td className='option'>
                                            {
                                                localStorage.getItem(Config.ADMIN) === '1' ?
                                                <h4 onClick={() => editaQuestao(item.id)}>
                                                    ✏️{item.id}
                                                </h4>
                                                :
                                                <h4 onClick={() => abreQuestao(item.id)}>
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
                                                <h4 onClick={() => abreQuestao(item.id)}>
                                                    ✏️{item.numeroQuestao}
                                                </h4>
                                            }
                                        </a>
                                    </td>
                                    <td>
                                        <h4 onClick={() => abreQuestao(item.id)}>
                                        {item.materia}
                                        </h4>
                                    </td>
                                    {
                                        filtro == -1 ?
                                        <td>
                                            {item.prova?.nomeProva}
                                        </td>
                                        :<></>
                                    }
                                    <td>
                                        {item?.respostasUsuarios?.find(element => item?.respostasQuestoes.find(elem => elem.codigo == element.codigoResposta && elem.certa === "1")) !== undefined ? 
                                        <button className='global-button-right global-button--full-width' onClick={() => abreQuestao(item.id)}>Respondida</button>
                                        :
                                        <>
                                        {
                                            item?.respostasUsuarios?.find(element => item?.respostasQuestoes.find(elem => elem.codigo == element.codigoResposta && elem.certa === "0")) !== undefined ? 
                                            <button className='global-button-wrong global-button--full-width' onClick={() => abreQuestao(item.id)}>Responder</button>
                                            :
                                            <button className='global-button global-button--full-width' onClick={() => abreQuestao(item.id)}>Responder</button>
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