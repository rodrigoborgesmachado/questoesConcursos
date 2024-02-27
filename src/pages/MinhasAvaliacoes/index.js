import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../services/api.js';
import { toast } from 'react-toastify';
import Config from './../../config.json';
import { BsFileEarmarkPlusFill } from "react-icons/bs";

function MinhasAvaliacoes(){
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(false);

    const[avaliacoes, setAvaliacoes] = useState([]);

    async function BuscaAvaliacoes(){
        setLoadding(true);

        await api.get('/Avaliacao/getAll')
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                setAvaliacoes(response.data.object);
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar avaliações');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar avaliações');
        })
    }

    useEffect(() => {
        BuscaAvaliacoes();
    }, []);

    function openAvaliacao(id){
        navigate('/cadastroavaliacao/' + id + '?previus=listagemminhasavaliacoes', {replace: true});
    }

    function abrirRespostas(id){
        navigate('/resultadoAvaliacao/' + id + '?page=1', {replace: true});
    }

    function addAvaliacao(){
        navigate('/cadastroavaliacao?previus=listagemminhasavaliacoes', { replace: true });
    }

    if (loadding) {
        return (
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="containerpage global-fullW">
            <div className='global-infoPanel'>
                <div className='opcoesFiltro'>
                    <h3>Minhas Avaliações</h3>
                    {
                        localStorage.getItem(Config.ADMIN) === '2' ?
                        <h3 className='link' onClick={addAvaliacao} ><BsFileEarmarkPlusFill/>Adicionar avaliação</h3>
                        :
                        <></>
                    }
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>
                            </th>
                            <th>
                                Nome
                            </th>
                            <th>
                                Chave
                            </th>
                            <th>
                                Nº Questões
                            </th>
                            <th>
                                Valor Total
                            </th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            avaliacoes.map((item, index) => {
                                return(
                                    <tr key={item}>
                                        <td className='option'>
                                            <h4 onClick={() => openAvaliacao(item.id)}>
                                                <VisibilityIcon className='vis' onClick={() => openAvaliacao(item.id)}/>
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.nome}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.isPublic == "1" ? "Pública" : "key"}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.questoesAvaliacao.length}
                                            </h4>
                                        </td>
                                        <td>
                                            {
                                                item.questoesAvaliacao.reduce((acc, questao) => acc + questao.notaQuestao, 0)
                                            }
                                        </td>
                                        <td>
                                            <button className='global-button global-button' onClick={() => abrirRespostas(item.id)}>Respostas</button>
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

export default MinhasAvaliacoes;