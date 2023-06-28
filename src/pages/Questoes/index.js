import './style.css';
import React from 'react';
import api from '../../services/api.js';
import Config from "../../config.json";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import { BsChatLeftDotsFill } from "react-icons/bs";
import { BsQuestionLg } from "react-icons/bs";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import Modal from 'react-modal';
import Tempo from './../../components/Tempo/tempo.js';

const customStyles = {
    content: {
      top: '20%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      border: 0,
      background: '#424242',
      marginRight: '-50%',
      'border-radius': '5px',
      transform: 'translate(-50%, -50%)',
    },
  };

function Questoes(){
    const navigate = useNavigate();
    const{filtro} = useParams();
    const[questao, setQuestao] = useState({});
    const[qtQuestoesCertas, setQtQuestoesCertas] = useState(parseInt(localStorage.getItem(Config.QUANTIDADE_QUESTOES_ACERTADAS) || 0));
    const[questoesTotal, setQuestoesTotal] = useState(parseInt(localStorage.getItem(Config.QUANTIDADE_QUESTOES_RESPONDIDAS) || 0));
    const[loadding, setLoadding] = useState(true);
    const[tentativas, setTentativas] = useState(0);
    const[maxTentativas] = useState(5);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalSolicitacao, setModalSolicitacao] = useState(false);
    const [modalSolicitaRespostaIsOpen, setModalSolicitaRespostaIsOpen] = useState(false);
    const [modalRespostaIsOpen, setModalRespostaIsOpen] = useState(false);
    const [textoResposta, setTextoResposta] = useState('');

    function openModalSolicitacao() {
        setModalSolicitacao(true);
    }

    function closeModalSolicitacao() {
        setModalSolicitacao(false);
    }

    function openModalSolicitarRevisao() {
        setIsOpen(true);
    }
    
    function closeModalSolicitarRevisao() {
        setIsOpen(false);
    }

    function openModalSolicitarResposta() {
        setModalSolicitaRespostaIsOpen(true);
    }
    
    function closeModalSolicitarResposta() {
        setModalSolicitaRespostaIsOpen(false);
    }

    function openModalResposta() {
        setModalRespostaIsOpen(true);
    }
    
    function closeModalResposta() {
        setModalRespostaIsOpen(false);
    }

    useEffect(() => {
        if(loadding){
            BuscarProximaQuestao();
            localStorage.setItem(Config.TEMPO_PARAM, 0);
        }
    }, [])
    
    function BuscaUrl(anterior = false, proxima = false){
        if(filtro === 'enem'){
            return `/Questoes/getQuestaoAleatoria?tipo=ENEM`;
        }
        else if(filtro === 'IFTM'){
            return `/Questoes/getQuestaoAleatoria?tipo=IFTM`;
        }
        else if(filtro.includes('materias')){
            return `/Questoes/getQuestaoAleatoria?tipo=GENERIC&subject=` + filtro.replace('materias&', '');
        }
        else if(filtro.includes('bancas')){
            return `/Questoes/getQuestaoAleatoria?tipo=GENERIC&bancas` + filtro.replace('bancas&', '');
        }
        else if(filtro.includes('provas') || filtro.includes('simulado')){
            let temp =  `/Questoes/getQuestao?codigoProva=` + filtro.replace('provas&', '').replace('simulado&', '');

            if(Object.keys(questao).length > 0){
                temp += "&numeroQuestao=" + (parseInt(questao?.numeroQuestao) + 1 - (anterior ? 2 : 0));
            }
            return temp;
        }
        else if(filtro.includes('codigoquestaohistorico')){
            return `/Questoes/getById?id=` + filtro.replace('codigoquestaohistorico:', '');
        }
        else if(filtro.includes('codigoquestaolistagem')){
            if(!proxima && !anterior){
                return `/Questoes/getById?id=` + filtro.replace('codigoquestaolistagem:', '');
            }

            let temp =  `/Questoes/getQuestao?codigoProva=` + questao?.codigoProva;
            let num = parseInt(questao?.numeroQuestao);
            if(anterior)
                num -=1;
            else
                num +=1;

            temp += "&numeroQuestao=" + num;

            return temp;

        }
        return `/Questoes/getQuestaoAleatoria?tipo=GENERIC`;
    }

    async function BuscarProximaQuestao(anterior = false, proxima = false){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        setLoadding(true);
        await api.get(BuscaUrl(anterior, proxima))
        .then(async (response) => {
            if(response.data.success){
                setQuestao(response.data.object);
            }
            else{
                var simulado = filtro.includes('simulado');
                
                if(response.data.message === 'Not registered'){
                    if(simulado){
                        toast.success('Prova finalizada!');
                        var data = {
                            respostas: localStorage.getItem(Config.Historico),
                            codigoProva: questao?.codigoProva,
                            tempo: parseInt(localStorage.getItem(Config.TEMPO_PARAM))
                        }

                        await api.post('/Simulado', data)
                        .then((response) => {
                            localStorage.removeItem(Config.Historico);

                            api.post('/Simulado/sendReportEmail?codigoSimulado=' + response.data.object.codigo);

                            navigate('/resultadosimulado/' + response.data.object.codigo, {replace: true});
                        })
                        .catch(() => {
                            toast.error('Error ao abrir resultado do simulado');
                            navigate('/simulado', {replace: true});
                        });
                    }
                    else{
                        toast.success('Você respondeu todas as questões dessa prova!');
                        navigate('/listagemprovas', {replace: true});
                    }
                    
                    return;
                }

                if(tentativas > maxTentativas){
                    toast.warn('Não há mais questões com esses filtros!');
                    navigate('/', {replace: true});
                    return;
                }

                setTentativas(tentativas+1);
                BuscarProximaQuestao();
                return;
            }
            setQuestoesTotal(questoesTotal+1);
            localStorage.setItem(Config.QUANTIDADE_QUESTOES_RESPONDIDAS, questoesTotal);
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
            temp = temp.replace(`<img src=\"#\" alt=\"Anexo\" id=\"divAnexo${i}\"/>`, `<img src=\"${anexos[i].anexo}\" alt=\"Anexo\" id=\"divAnexo${i}\"/>`);
        }

        return createMarkup(temp);
    }

    async function ValidaResposta(e, codigo){
        var simulado = filtro.includes('simulado');
        if(simulado)
            setLoadding(true);
        
        await api.get(`/RespostasQuestoes/validaResposta`, {
            params:{
                "id": codigo
            }
        })
        .then(async (response) => {
            if(simulado){
                var resposta = {
                    codigoProva: questao?.codigoProva,
                    codigoQuestao: questao?.codigo,
                    certa: response.data.object?.certa,
                    numeroQuestao: questao?.numeroQuestao
                };
                var historico = JSON.parse(localStorage.getItem(Config.Historico)) ?? new Array();
                historico.push(resposta);

                localStorage.setItem(Config.Historico, JSON.stringify(historico));
                BuscarProximaQuestao(false, true);
            }
            else{
                var div = document.createElement('div');
                div.style.justifyContent = 'right';
                div.style.paddingLeft = '20px';
                
                if(response.data.object?.certa == "1"){
                    div.style.color = 'green';
                    div.textContent = 'Correto';
                    toast.success('Resposta correta!');
                    
                    let lista = localStorage.getItem(Config.QUESTOES_FEITAS);
                    let listaResolvida = JSON.parse(lista) ?? [];
                    listaResolvida.push(codigo);
    
                    localStorage.setItem(Config.QUESTOES_FEITAS, JSON.stringify(listaResolvida));
                    localStorage.setItem(Config.QUANTIDADE_QUESTOES_ACERTADAS, qtQuestoesCertas+1);
                    setQtQuestoesCertas(qtQuestoesCertas+1);
    
                    var radios = document.getElementsByClassName('radioOption');
    
                    for(let i = 0; i<radios.length;i++){
                        radios[i].disabled = true;
                    }
                }
                else{
                    div.style.color = 'red';
                    div.textContent = 'Incorreto';
                    toast.warn('Resposta incorreta!');
    
                    e.target.checked = false;
                }
                e.target.parentElement.appendChild(div);
    
                if(filtro.includes('codigoquestaohistorico')){
                    navigate('/historico', true);
                }
            }
        }).catch((Exception) => {
            toast.warn('Erro ao validar resposta!');
            navigate('/', {replace: true});
            return;
        });
    }

    async function solicitarRevisao(){
        await api.get(`/Questoes/solicitaVerificacao`, {
            params:{
                "id": questao?.id
            }
        })
        .then((response) => {
            closeModalSolicitacao();
            if(response.data.success){
                toast.success('Solicitação enviada!');
            }
            else{
                toast.warn('Erro ao enviar solicitação!');
            }
            BuscarProximaQuestao();
        }).catch(() => {
            toast.warn('Erro ao solicitar!');
            navigate('/', {replace: true});
            return;
        });
    }

    async function buscaRespostaCorreta(){
        await api.get(`/RespostasQuestoes/getRespostaCorreta?questao=${questao?.id}`)
        .then((response) =>{
            closeModalSolicitacao();
            if(response.data.success){
                setTextoResposta(response.data?.object?.textoResposta);
                openModalResposta();
            }
        })
        .catch(() => {
            toast.warn('Erro ao buscar resposta correta!');
        })
    }

    function ListagemProva(){
        if(filtro.includes('codigoquestaohistorico')){
            navigate('/historico/', {replace: true});
        }
        else if(filtro.includes('codigoquestaolistagem')){
            navigate('/listagemquestoes/' + questao?.codigoProva, {replace: true});
        }
        else if(filtro.includes('simulado')){
            localStorage.removeItem(Config.Historico);
            navigate('/simulado', {replace: true});
        }
        else{
            navigate('/', {replace: true});
        }
    }

    function abrirSolicitarResposta(){
        closeModalSolicitacao();
        openModalSolicitarResposta();
    }

    function abrirSolicitarRevisão(){
        closeModalSolicitacao();
        openModalSolicitarRevisao();
    }

    if(loadding || !questao){
        return(
            <div className='loaddingDiv'>
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

    return(
        <div className="containerpage">
            <Modal
              isOpen={modalSolicitacao}
              onRequestClose={closeModalSolicitacao}
              style={customStyles}
              contentLabel="Solicitação"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>O que deseja fazer?</h3>
                    </div>
                    <div className='botoesModalSolicitacao'>
                        <button onClick={buscaRespostaCorreta}>Visualizar resposta</button>
                        <button onClick={solicitarRevisao}>Solicitar revisão da questão</button>
                    </div>
                </div>
            </Modal>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModalSolicitarRevisao}
              style={customStyles}
              contentLabel="Example Modal"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Deseja solicitar revisão da questão?</h3>
                    </div>
                    <div className='botoesModal'>
                        <button onClick={solicitarRevisao}>Solicitar</button>
                    </div>
                </div>
            </Modal>
            <Modal
              isOpen={modalSolicitaRespostaIsOpen}
              onRequestClose={closeModalSolicitarResposta}
              style={customStyles}
              contentLabel="Example Modal"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Deseja visualizar resposta da questão?</h3>
                    </div>
                    <div className='botoesModal'>
                        <button onClick={buscaRespostaCorreta}>Visualizar</button>
                    </div>
                </div>
            </Modal>
            <Modal
              isOpen={modalRespostaIsOpen}
              onRequestClose={closeModalResposta}
              style={customStyles}
              contentLabel="Example Modal"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>{textoResposta}</h3>
                    </div>
                </div>
            </Modal>
            <div className='opcoesQuestao'>
                <div className='total'>
                    {
                        filtro.includes('simulado') ? 
                        <></>
                        :
                        <h2 onClick={ListagemProva}><BsFillArrowLeftCircleFill size={40}/></h2>
                    }
                    <Tempo inicio={parseInt(localStorage.getItem(Config.TEMPO_PARAM))}/>
                </div>
                {
                    filtro.includes('simulado') ? 
                    <>
                    </>
                    :
                    <div className='opcaoVerificacao'>
                        <h2 onClick={openModalSolicitacao}>❓</h2>
                    </div>
                }
            </div>
            <div className='Materia'>
                <h2>Matéria: {questao?.materia}</h2>
            </div>
            <br/>
            <br/>
            <div className='descricaoQuestao'>
                {
                    questao?.anexosQuestoes?.length > 0 ?
                    <h4 dangerouslySetInnerHTML={createMarkupWithImages(questao?.campoQuestao, questao?.anexosQuestoes)}></h4>
                    :
                    <h4 dangerouslySetInnerHTML={createMarkup(questao?.campoQuestao)}></h4>
                }
                <br/>
                <br/>
                <div className='todasRespostas'>
                    {
                        questao?.respostasQuestoes?.map((item) => {
                            return(
                                <div key={item.id} className='respostasLista'>
                                    <label className='respostaLabel'>
                                        <input type='radio' className='radioOption' name={'Radio_' + item.codigo} onClick={(e) => ValidaResposta(e, item.codigo)}/>
                                        {
                                            item.anexoResposta.length > 0 ? 
                                            <div id="imagemResposta">
                                                <img src={item.anexoResposta[0].anexo}/>
                                            </div>
                                        : 
                                        <h4 dangerouslySetInnerHTML={createMarkup(item.textoResposta)} className='descricaoResposta'></h4>
                                    }
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                filtro.includes('simulado') ? 
                <></>
                :
                <div className='opcoesBotoesNavegacao'>
                    <div className='opcaoBotaoBefore'>
                        <h2><BsFillArrowLeftCircleFill size={40} onClick={() => {BuscarProximaQuestao(true, false);}}/></h2>
                    </div>
                    <div className='opcaoBotaoAfter'>
                        <h2><BsFillArrowRightCircleFill size={40} onClick={() => {BuscarProximaQuestao(false, true);}}/></h2>
                    </div>
                </div>
            }
        </div>
    )
}

export default Questoes;