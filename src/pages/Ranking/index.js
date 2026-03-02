import './style.css';
import api from '../../services/api.js';
import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Config from './../../config.json';
import {toast} from 'react-toastify';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader.js';
import { useAuth } from '../../auth/useAuth';

function Ranking(){
    const[loadding, setLoadding] = useState(true);
    const[lista, setLista] = useState({});
    const { session } = useAuth();
    const usuarioLogado = session?.username;
    const navigate = useNavigate();

    useEffect(() => {

        async function BuscarRanking(){
            

            await api.get('/RespostasUsuaro/ranking')
            .then((response) => {
                if(response.data.success){
                    setLista(response.data.object);
                }
                setLoadding(false);
            }).catch(() => {
                navigate('/', {replace: true});
                return;
            });
        }

        BuscarRanking();
    }, [])

    if(loadding){
        return(
            <PacmanLoader/>
        )
    }

    return(
        <div className="global-pageContainer">
            <h2>
                Ranking
            </h2>
            <Table className='global-table'>
                <thead>
                    <tr>
                        <th>
                            <h3>
                            Posição
                            </h3>
                        </th>
                        <th>
                            <h3>
                            Nome
                            </h3>
                        </th>
                        <th>
                            <h3>
                            Nº questões corretas
                            </h3>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        lista?.map((item, index) => {
                            return(
                                <tr key={item.nome} className={item.login === usuarioLogado  ? 'posicao' : ''}>
                                    <td>
                                        <h4>
                                            {index == 0 ? <>🥇</> : <></>}
                                            {index == 1 ? <>🥈</> : <></>}
                                            {index == 2 ? <>🥉</> : <></>}
                                            {index > 2 ? <>{index + 1}</> : <></>}
                                        </h4>
                                    </td>
                                    <td key={item.nome}>
                                        <h4>
                                            {index == 0 ? <>🏆</> : <></>}
                                            {item.nome}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4>
                                            {index == 0 ? <>🏆</> : <></>}
                                            {item.quantidade}
                                        </h4>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default Ranking;

