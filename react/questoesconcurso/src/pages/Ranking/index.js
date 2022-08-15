import './style.css';
import api from '../../services/api.js';
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

function Ranking(){
    const[loadding, setLoadding] = useState(true);
    const[lista, setLista] = useState({});
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
        <div className='container'>
            <h2>
                Ranking
            </h2>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>
                            <h2>
                            Posição
                            </h2>
                        </th>
                        <th>
                            <h2>
                            Nome
                            </h2>
                        </th>
                        <th>
                            <h2>
                            Nº questões corretas
                            </h2>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        lista?.lista?.map((item, index) => {
                            return(
                                <tr key={item.Nome}>
                                    <td>
                                        <h3>
                                            {index + 1}
                                        </h3>
                                    </td>
                                    <td key={item.Nome}>
                                        <h3>
                                        {item.Nome}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3>
                                        {item.Quantidade}
                                        </h3>
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