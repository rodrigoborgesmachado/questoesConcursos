import './style.css';
import React from 'react';
import api from '../../services/api.js';
import configData from "../../config.json";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';

function Questoes(){
    const navigate = useNavigate();
    const{filtro} = useParams();
    const[questao, setQuestao] = useState({});
    const[qtQuestoesCertas, setQtQuestoesCertas] = useState(parseInt(sessionStorage.getItem(configData.QUANTIDADE_QUESTOES_ACERTADAS) || 0));
    const[questoesTotal, setQuestoesTotal] = useState(parseInt(sessionStorage.getItem(configData.QUANTIDADE_QUESTOES_RESPONDIDAS) || 0));
    const[loadding, setLoadding] = useState(true);

    useEffect(() => {
        async function loadQuestao(){
            await BuscarProximaQuestao();
        }

        loadQuestao();
        setLoadding(false);
    }, [])

    function QuestaoJaResolvida(codigo){
        let lista = sessionStorage.getItem(configData.QUESTOES_FEITAS);
        let listaResolvida = JSON.parse(lista);

        return listaResolvida?.some((item) => item.Codigo === codigo).length > 0;
    }

    function BuscaUrl(){
        if(filtro === 'enem'){
            return `/BuscarQuestaoAleatoriaEnem.php/`;
        }
        return `/BuscarQuestaoAleatoria.php/`;
    }

    async function BuscarProximaQuestao(){
        setLoadding(true);
        await api.get(BuscaUrl())
        .then((response) => {
            if(response.data.Sucesso){
                setQuestao(response.data.lista[0]);

                if(QuestaoJaResolvida(questao?.questao?.Codigo)){
                    BuscarProximaQuestao();
                    return;
                }
            }
            else{
                BuscarProximaQuestao();
                return;
            }
            setQuestoesTotal(questoesTotal+1);
            sessionStorage.setItem(configData.QUANTIDADE_QUESTOES_RESPONDIDAS, questoesTotal);
            setLoadding(false);
        }).catch(() => {
            toast.error('Erro ao buscar questão');
            navigate('/', {replace: true});
            return;
        });
    }

    function createMarkup(text) { return {__html: text}; };

    function createMarkupWithImages(text, anexos){
        let temp = text;

        for(let i = 0; i< anexos.length; i++){
            temp = temp.replace(`<img src=\"#\" alt=\"Anexo\" id=\"divAnexo${i}\"/>`, `<img src=\"${anexos[i].Anexo}\" alt=\"Anexo\" id=\"divAnexo${i}\"/>`);
        }

        return createMarkup(temp);
    }

    async function ValidaResposta(codigo){
        await api.get(`/ValidaResposta.php/`, {
            params:{
                "codigoResposta": codigo
            }
        })
        .then((response) => {
            if(response.data.RespostaCorreta){
                toast.success('Resposta correta!');
                
                let lista = sessionStorage.getItem(configData.QUESTOES_FEITAS);
                let listaResolvida = JSON.parse(lista) ?? [];
                listaResolvida.push(codigo);

                sessionStorage.setItem(configData.QUESTOES_FEITAS, JSON.stringify(listaResolvida));
                sessionStorage.setItem(configData.QUANTIDADE_QUESTOES_ACERTADAS, qtQuestoesCertas+1);
                setQtQuestoesCertas(qtQuestoesCertas+1);
            }
            else{
                toast.warn('Resposta incorreta!');
            }
            BuscarProximaQuestao();
        }).catch(() => {
            navigate('/', {replace: true});
            return;
        });
    }


    if(loadding || !questao){
        return(
            <div className='loaddingDiv'>
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

    return(
        <div className='container'>
            <div className='total'>
                <h2>Questões corretas: {qtQuestoesCertas}/{questoesTotal}</h2>
            </div>
            <div className='Materia'>
                <h2>Matéria: {questao?.questao?.Materia}</h2>
            </div>
            <br/>
            <br/>
            <div className='descricaoQuestao'>
                {
                    questao?.questao?.anexosQuestao?.length > 0 ?
                    <h4 dangerouslySetInnerHTML={createMarkupWithImages(questao?.questao?.Campoquestao, questao?.questao?.anexosQuestao)}></h4>
                    :
                    <h4 dangerouslySetInnerHTML={createMarkup(questao?.questao?.Campoquestao)}></h4>
                }
            </div>
            <br/>
            <br/>
            <div className='todasRespostas'>
                {
                    questao?.respostas?.map((item) => {
                        return(
                            <div key={item.Codigo} className='respostas'>
                                <input type='radio' onClick={() => ValidaResposta(item.Codigo)}/>
                                {
                                item.anexos.length > 0 ? 
                                <div id="imagemResposta">
                                    <img src={item.anexos[0].Anexo}/>
                                </div>
                                : 
                                <h4 dangerouslySetInnerHTML={createMarkup(item.Textoresposta)} className='descricaoResposta'></h4>
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div ></div>
        </div>
    )
}

export default Questoes;