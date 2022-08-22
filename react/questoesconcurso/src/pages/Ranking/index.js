import './style.css';
import api from '../../services/api.js';
import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Config from './../../config.json';

function Ranking(){
    const[loadding, setLoadding] = useState(true);
    const[lista, setLista] = useState({});
    const[usuarioLogado] = useState(parseInt(sessionStorage.getItem(Config.CodigoUsuario) ? sessionStorage.getItem(Config.CodigoUsuario) : -1));
    const navigate = useNavigate();

    useEffect(() => {

        async function BuscarRanking(){
            await api.get('/BuscarRanking.php')
            .then((response) => {
                if(response.data.Sucesso){
                    setLista(response.data);
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
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

    return(
        <div className="containerpage">
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
                        lista?.lista?.map((item, index) => {
                            return(
                                <tr key={item.Nome} className={item.Codigo === usuarioLogado  ? 'posicao' : ''}>
                                    <td>
                                        <h4>
                                            {index + 1}
                                        </h4>
                                    </td>
                                    <td key={item.Nome}>
                                        <h4>
                                        {item.Nome}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4>
                                        {item.Quantidade}
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