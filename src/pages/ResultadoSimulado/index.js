import './resultado.css';
import Config from './../../config.json';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import api from '../../services/api.js';
import { Table } from 'react-bootstrap';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';

function Resultado(){
    const navigate = useNavigate();
    const{filtro} = useParams();
    const[prova, setProva] = useState({});
    const[tempo, setTempo] = useState(0);
    const[usuario, setUsuario] = useState(0);
    const[respostas, setResposta] = useState([]);
    const[loadding, setLoadding] = useState(true);

    async function buscaHistorico(codigoSimulado){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }
        
        await api.get('/Simulado/getById?id=' + codigoSimulado)
        .then((response) => {
            if(response.data.success){
                setResposta(JSON.parse(response.data.object.respostas));
                setUsuario(response.data.object.codigoUsuario);
                setProva(response.data.object.prova);
                setTempo(response.data.object.tempo);
                setLoadding(false);
            }
        }).catch(() => {
            toast.error('Erro ao buscar simulado');
            navigate('/', {replace: true});
            return;
        });
    }

    useEffect(() => {
        buscaHistorico(filtro);
    }, []);


    function baixarBoletinDetalhado(){
        setLoadding(true);
        api.get('/Simulado/reportDetail?codigoSimulado=' + filtro)
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                const link = document.createElement('a');
                link.href = response.data.object;
                link.download = 'Boletinho - Prova ' + prova.nomeProva.replace('/', '').replace('-', ' ') + localStorage.getItem(Config.Nome) + '.html';
                link.click();
            }
            else{
                toast.error('Simulado não encontrado');
            }
        })
        .catch((error) => {
            setLoadding(false);
            console.log(error);
            toast.error('Erro ao gerar o boletinho!');
        })
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

    return(
        <div className="containerpage">
            <h1>Resultado simulado prova {prova.nomeProva}:</h1>
            <br/>
            <div className='detalhesHistorico'>
                <h3>
                    Baixar boletin detalhado: <a target="_blank" onClick={() => baixarBoletinDetalhado()}>📩</a>
                    <br/>
                    Link da prova: <a target="_blank" href={prova.linkProva}>📩</a>
                    <br/>
                    Link do gabarito: <a target="_blank" href={prova.linkGabarito}>📩</a>
                    <br/>
                    Tempo: {tempo/60} minutos
                    <br/>
                    Quantidade de questões respondidas: {respostas.length }😁
                    <br/>
                    Quantidade de questões respondidas certas: {respostas.filter((item) => item.certa === '1').length}🤩
                    <br/>
                    Taxa de acertos: {Math.round((respostas.filter((item) => item.certa === '1').length/respostas.length)*100)}%
                    <br/>
                    Pontuação final: {Math.round((respostas.filter((item) => item.certa === '1').length/respostas.length)*100)} de 100
                </h3>
            </div>
            <div className='barraPrograsso'>
                <LinearProgressWithLabel value={Math.round(parseInt((respostas.filter((item) => item.certa === '1').length/respostas.length)*100))} />
            </div>
            <div className='respostasHistorico'>
                <Table>
                    <thead>
                        <tr>
                            <th>
                                <h3>
                                Questão
                                </h3>
                            </th>
                            <th>
                                <h3>
                                Resultado
                                </h3>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        respostas?.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td>
                                        <h4>
                                            Questão: {item.numeroQuestao}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4>
                                            Resposta: {item.certa === '1' ? "CORRETA🥳" : "INCORRETA😒"}
                                        </h4>
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

export default Resultado;