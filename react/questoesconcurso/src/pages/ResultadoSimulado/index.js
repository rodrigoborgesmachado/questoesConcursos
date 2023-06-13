import './resultado.css';
import Config from './../../config.json';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import api from '../../services/api.js';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.principal">
            <h4>
          {`${Math.round(
            props.value,
          )}%`}
            </h4></Typography>
        </Box>
      </Box>
    );
  }

function Resultado(){
    const navigate = useNavigate();
    const{filtro} = useParams();
    const[prova, setProva] = useState({});
    const[respostas, setResposta] = useState([]);
    const[loadding, setLoadding] = useState(true);

    async function buscaProva(codigoProva){
        setLoadding(true);
        
        await api.get('/Prova/getById?id=' + codigoProva)
        .then((response) => {
            if(response.data.success){
                setProva(response.data.object);
            }
            setLoadding(false);
        }).catch(() => {
            toast.error('Erro ao buscar provas');
            navigate('/', {replace: true});
            return;
        });
    }

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
                buscaProva(response.data.object.codigoProva);
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
                    Link da prova: <a target="_blank" href={prova.linkProva}>📩</a>
                    <br/>
                    Link do gabarito: <a target="_blank" href={prova.linkGabarito}>📩</a>
                    <br/>
                    Tempo: {parseInt(localStorage.getItem(Config.TEMPO_PARAM))/60} minutos
                    <br/>
                    Quantidade de questões respondidas: {respostas.length }😁
                    <br/>
                    Quantidade de questões respondidas certas: {respostas.filter((item) => item.certa === '1').length}🤩
                    <br/>
                    Taxa de acertos: {(respostas.filter((item) => item.certa === '1').length/respostas.length)*100}%
                    <br/>
                    <LinearProgressWithLabel value={parseInt((respostas.filter((item) => item.certa === '1').length/respostas.length)*100)} />
                </h3>
            </div>
            <div className='respostasHistorico'>
                {
                    respostas?.map((item, index) => {
                        return(
                            <div key={index} className='itensHistorico'>
                                <h4>
                                    Questão: {item.numeroQuestao}
                                    <br/>
                                    Resposta: {item.certa === '1' ? "CORRETA🥳" : "INCORRETA😒"}
                                    <br/>
                                </h4>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Resultado;