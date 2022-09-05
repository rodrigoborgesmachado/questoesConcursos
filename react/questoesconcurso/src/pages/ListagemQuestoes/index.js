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
            await api.get(`/BuscarListagemQuestoesProva.php?usuario=${(sessionStorage.getItem(Config.CodigoUsuario) == null || sessionStorage.getItem(Config.CodigoUsuario) === '0' ? '0' : sessionStorage.getItem(Config.CodigoUsuario))}&prova=${filtro}`)
            .then((response) => {
                if(response.data.Sucesso){
                    setQuestoes(response.data.lista);
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
    }, [])

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
                                <tr key={item.questao.Codigo}>
                                    <td>
                                        <h4>
                                            {item.questao.Numeroquestao}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4>
                                        {item.questao.Materia}
                                        </h4>
                                    </td>
                                    <td>
                                        <button onClick={() => abreQuestao(item.questao.Codigo)}>Visualizar</button>
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