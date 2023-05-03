import './style.css';
import { useState, useEffect } from 'react';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {toast} from 'react-toastify';
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

function HistoricoUsuario(){
    const navigate = useNavigate();
    
    if(sessionStorage.getItem(Config.LOGADO) == null || sessionStorage.getItem(Config.LOGADO) === '0'){
        navigate('/', {replace: true});
    }

    const[loadding, setLoadding] = useState(true);
    const[lista, setLita] = useState([]);
    const[qtTotal, setQtTotal] = useState(0);

    useEffect(() => {
        async function BuscarRespostas(){
            await api.get(`/RespostasUsuaro/getHistory`)
            .then(response => {
                setLita(response.data.object);
                setQtTotal(parseInt(response.data.quantity));
            })
            .catch(exception => {
                toast.warn(exception);
            });
            setLoadding(false);
        }

        BuscarRespostas();
    }, [])

    function abreQuestao(codigoQuestao){
        navigate('/questoes/codigoquestaohistorico:' + codigoQuestao, {replace: true});
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
            <h2>
                Histórico
            </h2>
            <br/>
            <div className='dadosResumidos'>
                Progresso:
                <br/>
                <br/>
                Total de questões tentadas: {qtTotal}
                <br/>
                Total de questões <b>certas</b> respondidas: {lista?.filter(item => item.respostaCorreta == '1')?.length}
                <br/>
                <br/>
                Taxa de acertos: 
                <LinearProgressWithLabel value={parseInt((lista?.filter(item => item.respostaCorreta == '1')?.length/lista?.length) * 100)} />
                <br/>
                Progresso de questões resolvidas: {lista?.filter(item => item.respostaCorreta == '1')?.length} de {qtTotal} 
                <LinearProgressWithLabel value={parseInt((lista?.filter(item => item.respostaCorreta == '1')?.length/qtTotal) * 100)} />
                <br/>
                <br/>
            </div>
            <div className='itens'>
                <h3>
                    Histórico de questões respondidas:
                </h3>
            {   
                lista?.map((item, index) => {
                    return(
                        <div key={index} className='descricao'>
                            <h4>
                                Prova: {item.nomeProva}
                                <br/>
                                Questão: {item.numeroQuestao}
                                <br/>
                                Resposta: {item.respostaCorreta == '1' ? "CORRETA" : "INCORRETA"}
                                <br/>
                                Data resposta: {item.dataResposta?.replace('T', ' ')}
                                <br/>
                                <button onClick={() => abreQuestao(item.codigoQuestao)}>Visualizar Questão</button>
                                <br/>
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

export default HistoricoUsuario;