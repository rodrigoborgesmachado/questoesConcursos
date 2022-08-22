import './style.css';
import { useState, useEffect } from 'react';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {toast} from 'react-toastify';

function HistoricoUsuario(){
    const navigate = useNavigate();
    
    if(sessionStorage.getItem(Config.LOGADO) == null || sessionStorage.getItem(Config.LOGADO) === '0'){
        navigate('/', {replace: true});
    }

    const[loadding, setLoadding] = useState(true);
    const[lista, setLita] = useState([]);

    useEffect(() => {
        async function BuscarRespostas(){
            await api.get(`BuscarRespostasUsuario.php?codigoUsuario=${sessionStorage.getItem(Config.CodigoUsuario)}`)
            .then(response => {
                setLita(response.data.lista);
            })
            .catch(exception => {
                toast.warn(exception);
            });
            setLoadding(false);
        }

        BuscarRespostas();
    }, [])

    function abreQuestao(codigoQuestao){
        navigate('/questoes/codigoquestao:' + codigoQuestao, {replace: true});
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
                Total de questões tentadas: {lista?.length}
                <br/>
                Total de questões <b>certas</b> respondidas: {lista?.filter(item => item.RespostaCorreta)?.length}
                <br/>
                <br/>

            <hr/>
            </div>
            <div className='itens'>
            {
                lista?.map((item, index) => {
                    return(
                        <div key={index} className='descricao'>
                            <h4>
                                Prova: {item.NomeProva}
                                <br/>
                                Questão: {item.NumeroQuestao}
                                <br/>
                                Resposta: {item.RespostaCorreta ? "CORRETA" : "INCORRETA"}
                                <br/>
                                Data resposta: {item.DataResposta.split('T')[0]}
                                <br/>
                                <button onClick={() => abreQuestao(item.CodigoQuestao)}>Visualizar Questão</button>
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