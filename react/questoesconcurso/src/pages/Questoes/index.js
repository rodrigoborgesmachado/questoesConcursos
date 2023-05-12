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
    const [modalSolicitaRespostaIsOpen, setModalSolicitaRespostaIsOpen] = useState(false);
    const [modalRespostaIsOpen, setModalRespostaIsOpen] = useState(false);
    const [textoResposta, setTextoResposta] = useState('');

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
        if(loadding)
            BuscarProximaQuestao();
    }, [])
    
    function BuscaUrl(anterior = false, proxima = false){
        if(filtro === 'enem'){
            return `/Questoes/getQuestaoAleatoria?tipo=ENEM`;
        }
        else if(filtro.includes('materias')){
            return `/Questoes/getQuestaoAleatoria?tipo=GENERIC&subject=` + filtro.replace('materias&', '');
        }
        else if(filtro.includes('bancas')){
            return `/Questoes/getQuestaoAleatoria?tipo=GENERIC&bancas` + filtro.replace('bancas&', '');
        }
        else if(filtro.includes('provas')){
            let temp =  `/Questoes/getQuestao?codigoProva=` + filtro.replace('provas&', '');

            if(Object.keys(questao).length > 0){
                temp += "&numeroQuestao=" + (questao?.numeroquestao + 1 - (anterior ? 2 : 0));
            }
            else{
                temp += "&numeroQuestao=1";
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
        .then((response) => {
            if(response.data.success){
                setQuestao(response.data.object);
            }
            else{
                if(response.data.Mensagem === 'Não há mais itens!'){
                    toast.success('Você respondeu todas as questões dessa prova!');
                    navigate('/listagemprovas', {replace: true});
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
        await api.get(`/RespostasQuestoes/validaResposta`, {
            params:{
                "id": codigo
            }
        })
        .then(async (response) => {
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
            closeModalSolicitarRevisao();
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
            closeModalSolicitarResposta();
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
        navigate('/listagemquestoes/' + questao?.codigoProva, {replace: true});
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
                    <h2 onClick={ListagemProva}><BsFillArrowLeftCircleFill size={40}/>Questões corretas: {qtQuestoesCertas}/{questoesTotal}</h2>
                </div>
                <div className='opcaoVerificacao'>
                    <h2><BsChatLeftDotsFill onClick={openModalSolicitarRevisao}/></h2>
                    <h2><BsQuestionLg onClick={openModalSolicitarResposta}/></h2>
                </div>
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
            </div>
            <br/>
            <br/>
            <div className='todasRespostas'>
                {
                    questao?.respostasQuestoes?.map((item) => {
                        return(
                            <div key={item.id} className='respostas'>
                                <label className='respostas'>
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
            <div className='opcoesBotoesNavegacao'>
                <div className='opcaoBotaoBefore'>
                    <h2><BsFillArrowLeftCircleFill size={40} onClick={() => {BuscarProximaQuestao(true, false);}}/></h2>
                </div>
                <div className='opcaoBotaoAfter'>
                    <h2><BsFillArrowRightCircleFill size={40} onClick={() => {BuscarProximaQuestao(false, true);}}/></h2>
                </div>
            </div>
            <div ></div>
        </div>
    )
}

export default Questoes;