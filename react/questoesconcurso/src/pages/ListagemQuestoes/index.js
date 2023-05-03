import './style.css';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import {toast} from 'react-toastify';
import api from '../../services/api.js';
import { useParams, useNavigate } from 'react-router-dom';
import Config from './../../config.json';

function ListagemQuestoes(){
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(true);
    const{filtro} = useParams();
    const[questoes, setQuestoes] = useState([])

    useEffect(() => {
        async function buscaQuestoes(){
            if(!sessionStorage.getItem(Config.TOKEN)){
                toast.info('Necessário logar para acessar!');
                navigate('/', {replace: true});
                return;
            }

            await api.get(`/Questoes/pagged?page=1&quantity=10000&anexos=false&codigoProva=${filtro}`)
            .then((response) => {
                if(response.data.success){
                    setQuestoes(response.data.object);
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

        buscaQuestoes();
    }, [loadding])

    function abreQuestao(codigoQuestao){
        navigate('/questoes/codigoquestaolistagem:' + codigoQuestao, {replace: true});
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

    return(
        <div className='containerpage'>
            <h2>Questões</h2>
            <div className='questoes'>
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
                                        <h4>
                                            {item.numeroQuestao}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4>
                                        {item.materia}
                                        </h4>
                                    </td>
                                    <td>
                                        {item?.respostasUsuarios?.find(element => item?.respostasQuestoes.find(elem => elem.codigo == element.codigoResposta && elem.certa === "1")) !== undefined ? 
                                        <button className='respondida' onClick={() => abreQuestao(item.id)}>Respondida</button>
                                        :
                                        <>
                                        {
                                            item?.respostasUsuarios?.find(element => item?.respostasQuestoes.find(elem => elem.codigo == element.codigoResposta && elem.certa === "0")) !== undefined ? 
                                            <button className='errado' onClick={() => abreQuestao(item.id)}>Responder</button>
                                            :
                                            <button className='responder' onClick={() => abreQuestao(item.id)}>Responder</button>
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