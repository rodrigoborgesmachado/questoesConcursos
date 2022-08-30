import './style.css';
import React from 'react';
import api from '../../services/api.js';
import Config from "../../config.json";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import { BsChatLeftDotsFill } from "react-icons/bs";
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
    const[qtQuestoesCertas, setQtQuestoesCertas] = useState(parseInt(sessionStorage.getItem(Config.QUANTIDADE_QUESTOES_ACERTADAS) || 0));
    const[questoesTotal, setQuestoesTotal] = useState(parseInt(sessionStorage.getItem(Config.QUANTIDADE_QUESTOES_RESPONDIDAS) || 0));
    const[loadding, setLoadding] = useState(true);
    const[tentativas, setTentativas] = useState(0);
    const[maxTentativas] = useState(5);
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }
    
    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        async function loadQuestao(){
            await BuscarProximaQuestao();
            setLoadding(false);
        }

        loadQuestao();
    }, [])

    function QuestaoJaResolvida(codigo){
        let lista = sessionStorage.getItem(Config.QUESTOES_FEITAS);
        let listaResolvida = JSON.parse(lista);

        return listaResolvida?.some((item) => item.Codigo === codigo).length > 0;
    }

    function BuscaUrl(){
        if(filtro === 'enem'){
            return `/BuscarQuestaoAleatoriaEnem.php/`;
        }
        else if(filtro.includes('materias')){
            return `/BuscarQuestaoMateria.php?Materia=` + filtro.replace('materias&', '');
        }
        else if(filtro.includes('bancas')){
            return `/BuscarQuestaoBanca.php?Bancas=` + filtro.replace('bancas&', '');
        }
        else if(filtro.includes('provas')){
            let temp =  `/BuscarQuestaoProva.php?codigoProva=` + filtro.replace('provas&', '');

            if(Object.keys(questao).length > 0){
                temp += "&ultimaQuestao=" + questao?.questao?.Numeroquestao;
            }
            else{
                temp += "&ultimaQuestao=0";
            }

            if(sessionStorage.getItem(Config.LOGADO) === '1'){
                temp+= "&codigoUsuario=" + sessionStorage.getItem(Config.CodigoUsuario);
            }
            else{
                temp+="&codigoUsuario=0";
            }

            return temp;
        }
        else if(filtro.includes('codigoquestaohistorico')){
            return `/BuscarQuestao.php?codigoQuestao=` + filtro.replace('codigoquestaohistorico:', '');
        }
        else if(filtro.includes('codigoquestaolistagem')){
            return `/BuscarQuestao.php?codigoQuestao=` + filtro.replace('codigoquestaolistagem:', '');
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
                if(response.data.Mensagem === 'Não há mais itens!'){
                    toast.success('Você respondeu todas as questões dessa prova!');
                    navigate('/', {replace: true});
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
            sessionStorage.setItem(Config.QUANTIDADE_QUESTOES_RESPONDIDAS, questoesTotal);
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
        .then(async (response) => {
            if(sessionStorage.getItem(Config.LOGADO) === '1'){
                await insereResposta(codigo);
            }

            if(response.data.RespostaCorreta){
                toast.success('Resposta correta!');
                
                let lista = sessionStorage.getItem(Config.QUESTOES_FEITAS);
                let listaResolvida = JSON.parse(lista) ?? [];
                listaResolvida.push(codigo);

                sessionStorage.setItem(Config.QUESTOES_FEITAS, JSON.stringify(listaResolvida));
                sessionStorage.setItem(Config.QUANTIDADE_QUESTOES_ACERTADAS, qtQuestoesCertas+1);
                setQtQuestoesCertas(qtQuestoesCertas+1);
            }
            else{
                toast.warn('Resposta incorreta!');
            }

            if(filtro.includes('codigoquestaohistorico')){
                navigate('/historico', true);
            }
            else if(filtro.includes('codigoquestaolistagem')){
                navigate('/listagemquestoes/' + questao?.questao?.Codigoprova, true);
            }
            else{
                BuscarProximaQuestao();
            }
        }).catch(() => {
            toast.warn('Erro ao validar resposta!');
            navigate('/', {replace: true});
            return;
        });
    }

    async function insereResposta(codigoResposta){
        await api.post(`/InsereResposta.php`, 
        {
            Codigousuario: sessionStorage.getItem(Config.CodigoUsuario),
            Codigoresposta: codigoResposta
        }
        )
        .then((response) => {
            if(response.data.Sucesso){
                console.log('Resposta salva para o usuário');
            }
            else{
                console.log('Erro ao salvar resposta!');
            }
        })
        .catch(() =>{
            console.log('Erro ao salvar resposta');
        })
    }

    async function solicitarRevisao(){
        await api.get(`/SolicitaVerificacao.php`, {
            params:{
                "codigoQuestao": questao?.questao?.Codigo
            }
        })
        .then((response) => {
            closeModal();
            if(response.data.Sucesso){
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
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Deseja Solicitar revisão da questão?</h3>
                    </div>
                    <div className='botoesModal'>
                        <button onClick={solicitarRevisao}>Solicitar</button>
                    </div>
                </div>
            </Modal>
            <div className='opcoesQuestao'>
                <div className='total'>
                    <h2>Questões corretas: {qtQuestoesCertas}/{questoesTotal}</h2>
                </div>
                <div className='opcaoVerificacao'>
                    <h2><BsChatLeftDotsFill onClick={openModal}/></h2>
                </div>
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