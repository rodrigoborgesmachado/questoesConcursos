import './style.css';
import { useState, useEffect } from 'react';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {toast} from 'react-toastify';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

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
    
    if(localStorage.getItem(Config.LOGADO) == null || localStorage.getItem(Config.LOGADO) === '0'){
        navigate('/', {replace: true});
    }

    const[loadding, setLoadding] = useState(true);
    const[lista, setLita] = useState([]);
    const[qtTotal, setQtTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(10);

    async function BuscarRespostas(page){
        await api.get(`/RespostasUsuaro/getHistory?page=` + page + `&quantity=` + quantityPerPage)
        .then(response => {
            setLita(response.data.object);
            setQtTotal(parseInt(response.data.total));
            setQuantity(parseInt(response.data.quantity));
        })
        .catch(exception => {
            toast.warn(exception);
        });
        setLoadding(false);
    }

    useEffect(() => {
        setLoadding(true);
        BuscarRespostas(1);
    }, [])

    function abreQuestao(codigoQuestao){
        navigate('/questoes/codigoquestaohistorico:' + codigoQuestao, {replace: true});
    }

    const handleChange = (event, value) => {
        setPage(value);
        setLoadding(true);
        BuscarRespostas(value);
      };

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
                Progresso:✅
                <br/>
                <br/>
                Total de questões tentadas: {qtTotal}😁
                <br/>
                Total de questões <b>certas</b> respondidas: {quantity}🤩
                <br/>
                <br/>
                Progresso de questões resolvidas corretamente: {quantity} de {qtTotal} 
                <LinearProgressWithLabel value={parseInt((quantity/qtTotal) * 100)} />
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
                                Prova: {item.nomeProva}📚
                                <br/>
                                Questão: {item.numeroQuestao}
                                <br/>
                                Resposta: {item.respostaCorreta === '1' ? "CORRETA🥳" : "INCORRETA😒"}
                                <br/>
                                Data resposta: {item.dataResposta?.replace('T', ' ')}
                                <br/>
                                <button onClick={() => abreQuestao(item.codigoQuestao)}>Visualizar Questão✏️</button>
                                <br/>
                                <br/>
                            </h4>
                        </div>
                    )
                })
            }
            {
                qtTotal > 0 ?
                <Stack spacing={4}>
                    <Pagination count={parseInt((qtTotal/quantityPerPage)+1)} page={page} color="primary" showFirstButton showLastButton onChange={handleChange}/>
                </Stack>    
                :
                <>
                </>
            }
            </div>
        </div>
    )
}

export default HistoricoUsuario;