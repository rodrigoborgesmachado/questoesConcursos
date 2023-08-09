import './style.css';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import {toast} from 'react-toastify';
import api from '../../services/api.js';
import { useParams, useNavigate } from 'react-router-dom';
import { BsFileEarmarkPlusFill } from "react-icons/bs";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Config from './../../config.json';

function ListagemQuestoes(){
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(true);
    const{filtro} = useParams();
    const[questoes, setQuestoes] = useState([])
    const[prova, setProva] = useState({})

    useEffect(() => {
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
                    buscaQuestoes();
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

        async function buscaQuestoes(){
            if(!localStorage.getItem(Config.TOKEN)){
                toast.info('Necessário logar para acessar!');
                navigate('/', {replace: true});
                return;
            }

            await api.get(`/Questoes/pagged?page=1&quantity=10000&anexos=false&codigoProva=${filtro}`)
            .then((response) => {
                if(response.data.success){
                    setQuestoes(response.data.object.sort((a, b) => parseInt(a.numeroQuestao) - parseInt(b.numeroQuestao)));
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

        buscaProva();
    }, [loadding])

    function abreQuestao(codigoQuestao){
        navigate('/questoes/codigoquestaolistagem:' + codigoQuestao, {replace: true});
    }

    function addQuestao(){
        navigate('/cadastraQuestao/' + filtro, {replace: true});
    }

    function voltarListagemProva(){
        var page = localStorage.getItem(Config.PaginaListagem) == null ? '1' : localStorage.getItem(Config.PaginaListagem);
        navigate('/listagemprovas/' + page, {replace: true});
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
            <h2 className='nomeProvaDescricao'>
                Prova: {prova.nomeProva} 
            </h2>
            <div className='opcoesQuestoes'>
                <h2>Questões</h2>
                <div className='opcaoFiltro'>
                    {
                        localStorage.getItem(Config.ADMIN) == '1' ?
                        <h2 onClick={addQuestao}><BsFileEarmarkPlusFill/>  Adicionar</h2>
                        :
                        <></>
                    }
                </div>
            </div>
            
            <div className='global-fullW'>
            <Table>
                <thead>
                    <tr>
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
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        questoes.map((item) => {
                            return(
                                <tr key={item.id}>
                                    <td>
                                        <h4 onClick={() => abreQuestao(item.id)}>
                                        ✏️{item.numeroQuestao}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 onClick={() => abreQuestao(item.id)}>
                                        {item.materia}
                                        </h4>
                                    </td>
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
        </div>
    )
}

export default ListagemQuestoes;