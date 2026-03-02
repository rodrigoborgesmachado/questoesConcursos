import './style.css';
import { useState, useEffect } from 'react';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader';
import { useAuth } from '../../auth/useAuth';

function HistoricoUsuario() {
    const navigate = useNavigate();
    const { isAuthenticated, session } = useAuth();

    if (!isAuthenticated) {
        navigate('/login', { replace: true });
    }

    const [loadding, setLoadding] = useState(true);
    const [lista, setLita] = useState([]);
    const [qtTotal, setQtTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(10);

    async function BuscarRespostas(page) {
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

    function abreQuestao(codigoQuestao) {
        localStorage.setItem(Config.lastLink, "/historico");
        navigate('/questoes/codigoquestaohistorico:' + codigoQuestao + '?id=' + codigoQuestao + '&page=0', { replace: true });
    }

    const handleChange = (event, value) => {
        setPage(value);
        setLoadding(true);
        BuscarRespostas(value);
    };

    function baixarBoletinDetalhado() {
        setLoadding(true);
        api.get('/RespostasQuestoes/reportDetail')
            .then((response) => {
                setLoadding(false);
                if (response.data.success) {
                    const link = document.createElement('a');
                    link.href = response.data.object;
                    link.download = 'Histórico - ' + session?.name + '.html';
                    link.click();
                }
                else {
                    toast.error('Histórico não encontrado');
                }
            })
            .catch((error) => {
                setLoadding(false);
                console.log(error);
                toast.error('Erro ao gerar o boletinho!');
            })
    }

    if (loadding) {
        return (
            <PacmanLoader/>
        )
    }

    return (
        <div className='containerpage global-fullW'>
            <div className='dados global-infoPanel'>
                <h2>
                    Histórico de questões
                </h2>
                <div className="separator separator--withMargins"></div>
                <div className='dadosResumidos'>
                    Progresso:✅
                    <p>
                        Baixar histórico detalhado: <a target="_blank" onClick={() => baixarBoletinDetalhado()}>📩</a>
                    </p>
                    <p>
                        Total de questões tentadas: {qtTotal}😁
                    </p>

                    <p>
                        Total de questões <b>certas</b> respondidas: {quantity}🤩
                    </p>
                    <p>
                        Progresso de questões resolvidas corretamente: {quantity} de {qtTotal}
                    </p>
                    <p>
                        <LinearProgressWithLabel sx={{
                  backgroundColor: 'var(--progress-track-color)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'var(--progress-bar-color)'
                  }}} value={parseInt((quantity / qtTotal) * 100)} />
                    </p>
                </div>
            </div>

            <div className='itensPaginacao global-infoPanel'>
                <h3>
                    Histórico de questões respondidas:
                </h3>

                <div className='separator separator--withMargins'></div>

                {
                    lista?.map((item, index) => {
                        return (
                            <div key={index} className='descricao'>
                                <h4 className='dadosResumidos'>
                                    <p>
                                        Prova: {item.nomeProva}📚
                                    </p>
                                    <p>
                                        Questão: {item.numeroQuestao}
                                    </p>
                                   <p>
                                        Resposta: {item.respostaCorreta === '1' ? "CORRETA🥳" : "INCORRETA😒"}
                                   </p>
                                   <p>
                                        Data resposta: {item.dataResposta?.replace('T', ' ')}
                                   </p>

                                    <div className='global-buttonWrapper'>
                                        <button className='global-button global-button--transparent' onClick={() => abreQuestao(item.codigoQuestao)}>✏️ Visualizar Questão</button>
                                    </div>

                                </h4>
                            </div>
                        )
                    })
                }
                
            </div>
            <div className='global-mt'>
            {
                    qtTotal > 0 ?
                        <Stack spacing={4}>
                            <Pagination sx={{
                    '& .Mui-selected': {
                        color: 'var(--pagination-item-color)'},
                    '& .MuiPaginationItem-root': {
                        color: 'var(--pagination-item-color)',
                  
                  }}} count={parseInt((qtTotal / quantityPerPage) + 1)} page={page} color="primary" showFirstButton showLastButton onChange={handleChange} />
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
