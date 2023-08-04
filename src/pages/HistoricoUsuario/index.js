import './style.css';
import { useState, useEffect } from 'react';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {toast} from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';

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

      function baixarBoletinDetalhado(){
        setLoadding(true);
        api.get('/RespostasQuestoes/reportDetail')
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                const link = document.createElement('a');
                link.href = response.data.object;
                link.download = 'Histórico - ' + localStorage.getItem(Config.Nome) + '.html';
                link.click();
            }
            else{
                toast.error('Histórico não encontrado');
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
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className='containerpage'>
            <h2>
                Histórico de questões
            </h2>
            <br/>
            <div className='dadosResumidos'>
                Progresso:✅
                <br/>
                <br/>
                Baixar histórico detalhado: <a target="_blank" onClick={() => baixarBoletinDetalhado()}>📩</a>
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
            <div className='itensPaginacao'>
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
                                <button className='global-button global-button--full-width' onClick={() => abreQuestao(item.codigoQuestao)}>Visualizar Questão✏️</button>
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