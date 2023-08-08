import './style.css';
import api from '../../services/api.js';
import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Config from './../../config.json';
import {toast} from 'react-toastify';

function Ranking(){
    const[loadding, setLoadding] = useState(true);
    const[lista, setLista] = useState({});
    const[usuarioLogado] = useState(localStorage.getItem(Config.USUARIO));
    const navigate = useNavigate();

    useEffect(() => {

        async function BuscarRanking(){
            if(!localStorage.getItem(Config.TOKEN)){
                toast.info('Necessário logar para acessar!');
                navigate('/', {replace: true});
                return;
            }

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
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="global-pageContainer">
            <h2>
                Ranking
            </h2>
            <Table>
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