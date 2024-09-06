import './style.css';
import React from 'react';
import api from '../../services/api.js';
import Config from "../../config.json";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import { BsChatLeftDotsFill } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import Modal from 'react-modal';
import Tempo from './../../components/Tempo/tempo.js';
import { customStyles } from '../../services/functions.js';

  const customStylesAssunto = {
    content: {
      left: '25%',
      right: 'auto',
      bottom: 'auto',
      border: 0,
      background: '#424242',
      'border-radius': '5px',
      width: '50%',
    },
  };

  const customStylesComentario = {
    content: {
      left: '10%',
      right: 'auto',
      bottom: 'auto',
      border: 0,
      background: '#424242',
      'border-radius': '5px',
      width: '80%',
    },
  };


function Questoes(){
    const style = customStyles();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);

    const{filtro} = useParams();
    const[questao, setQuestao] = useState({});
    const[comentarios, setComentarios] = useState([]);
    const[qtQuestoesCertas, setQtQuestoesCertas] = useState(parseInt(localStorage.getItem(Config.QUANTIDADE_QUESTOES_ACERTADAS) || 0));
    const[questoesTotal, setQuestoesTotal] = useState(parseInt(localStorage.getItem(Config.QUANTIDADE_QUESTOES_RESPONDIDAS) || 0));
    const[loadding, setLoadding] = useState(true);
    const[modalIsOpen, setIsOpen] = useState(false);
    const[modalSolicitacao, setModalSolicitacao] = useState(false);
    const[modalSolicitaRespostaIsOpen, setModalSolicitaRespostaIsOpen] = useState(false);
    const[modalRespostaIsOpen, setModalRespostaIsOpen] = useState(false);
    const[modalComentarioIsOpen, setModalComentarioIsOpen] = useState(false);
    const[textoResposta, setTextoResposta] = useState('');
    const[comentario, setComentario] = useState('');
    const[nextAvaliacao, setNextAvaliacao] = useState(-1);
    const[modalAssuntoIsOpen, setModalAssuntoIsOpen] = useState(false);
    const[assunto, setAssunto] = useState('');
    const[page, setPage] = useState(parseInt(searchParams.get('page')));

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

    function openModalComentario() {
        setModalComentarioIsOpen(true);
    }

    function closeModalComentario() {
        setModalComentarioIsOpen(false);
    }

    function openModalAssunto() {
        setAssunto(questao.assunto);
        setModalAssuntoIsOpen(true);
    }

    function closeModalAssunto() {
        setModalAssuntoIsOpen(false);
    }

    useEffect(() => {
        if(loadding){
            BuscarProximaQuestao();
            localStorage.setItem(Config.TEMPO_PARAM, 0);
        }
    }, [])
    
    function BuscaUrl(anterior = false, proxima = false, page=1){
        var query = searchParams;
        if(proxima)
        {
            query.delete('id');
        }
        else if(anterior)
        {
            query.delete('id');
        }

        var url = `/Questoes/pagged?page=${page}&quantity=1&anexos=true&` + query;
       
        return url;
    }

    async function BuscarProximaQuestao(anterior = false, proxima = false){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        setLoadding(true);

        var numQuestao = page;
        if(proxima)
        {
            numQuestao +=1;
        }
        else if(numQuestao>1 && anterior)
        {
            numQuestao -=1;
        }
        setPage(numQuestao);

        await api.get(BuscaUrl(anterior, proxima, numQuestao))
        .then(async (response) => {
            if(response.data.success && response.data.quantity > 0){
                setQuestao(response.data.object[0]);
                buscarComentarios(response.data.object[0].Id);
            }
            else{
                var simulado = filtro.includes('simulado');
                var avaliacao = filtro.includes('avaliacao');
                
                if(response.data.quantity == 0){
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
                    else if(avaliacao){
                        toast.success('Você respondeu todas as questões dessa avaliação!');
                        navigate('/resultadoAvaliacao/' + filtro.split('avaliacao&')[1], {replace: true});
                    }
                    else{
                        toast.success('Você respondeu todas as questões dessa prova!');
                        navigate('/listagemprovas/1', {replace: true});
                    }
                    
                    return;
                }

                toast.warn('Não há mais questões com esses filtros!');
                navigate('/', {replace: true});
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

    async function BuscarQuestaoById(id){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        setLoadding(true);
        await api.get('/questoes/getById?id=' + id)
        .then(async (response) => {
            if(response.data.success){
                setQuestao(response.data.object);
                buscarComentarios(response.data.object.Id);
            }
            else{
                toast.error('Erro ao buscar questão');
            }

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
            temp = temp.replace(`<img src=\"#\" alt=\"Anexo\" id=\"divAnexo${i}\"/>`, `<img src=\"${anexos[i].link}\" alt=\"Anexo\" id=\"divAnexo${i}\"/>`);
        }

        return createMarkup(temp);
    }

    async function ValidaResposta(e, codigo){
        var simulado = filtro.includes('simulado');
        var avaliacao = filtro.includes('avaliacao');

        if(simulado || avaliacao)
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
            else if(avaliacao){
                GravaRespostaAvaliacao(filtro.replace('avaliacao&', ''), questao?.Id, codigo);
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
    
                if(filtro.includes('codigoquestaohistoricoadmin')){
                    navigate('/historicoadmin', true);
                }
                else if(filtro.includes('codigoquestaohistorico')){
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
                "id": questao?.Id
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

    async function revisar(){
        await api.get(`/Questoes/revisar`, {
            params:{
                "id": questao?.Id
            }
        })
        .then((response) => {
            closeModalSolicitacao();
            if(response.data.success){
                toast.success('Questão revisada!');
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

    function editaQuestao(){
        navigate('/cadastraQuestao/' + questao?.codigoProva + '/1/' + questao?.Id + '?' + searchParams, {replace: true});
    }

    async function buscaRespostaCorreta(){
        await api.get(`/RespostasQuestoes/getRespostaCorreta?questao=${questao?.Id}`)
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
        if(filtro.includes('codigoquestaohistoricoadmin')){
            navigate('/historicoadmin/', {replace: true});
        }
        else if(filtro.includes('codigoquestaohistorico')){
            navigate('/historico/', {replace: true});
        }
        else if(filtro.includes('codigoquestaolistagemsemprova')){
            navigate('/listagemquestoes' + (searchParams.get('pageListagem') ? '?page=' + searchParams.get('pageListagem') : ''), {replace: true});
        }
        else if(filtro.includes('codigoquestaolistagem')){
            navigate('/listagemquestoes/' + questao?.codigoProva + '?page=' + searchParams.get('pageListagem'), {replace: true});
        }
        else if(filtro.includes('simulado')){
            localStorage.removeItem(Config.Historico);
            navigate('/simulado', {replace: true});
        }
        else if(filtro.includes('avaliacao')){
            localStorage.removeItem(Config.Historico);
            navigate('/avaliacoes/' + filtro.replace('avaliacao&', ''), {replace: true});
        }
        else{
            navigate(localStorage.getItem(Config.lastLink), {replace: true});
        }
    }

    async function buscarComentarios(questaoId){
        setLoadding(true);
        await api.get('/ComentariosQuestoes/getByQuestao?questao=' + questaoId)
        .then(async (response) => {
            if(response.data.success){
                setComentarios(response.data.object);
            }
            else{
                toast.error('Erro ao buscar');
            }

            setLoadding(false);
        }).catch(() => {
            setLoadding(false);
            toast.error('Erro ao buscar comentários');
        });
    }

    function montaData(data){
        var temp = data.split('T')[0];
        var temp2 = data.split('T')[1];
        return temp.split('-')[2] + '/' + temp.split('-')[1] + '/' + temp.split('-')[0] + ' ' + temp2.split('.')[0];
    }

    async function fazComentario(){
        var data = {
            "comentario": comentario,
            "codigoQuestao": questao?.Id
        };

        setLoadding(true);

        await api.post(`/ComentariosQuestoes`, 
        data
        )
        .then((response) => {
            setLoadding(false);
            closeModalComentario();
            setComentario('');

            if(response.data.success){
                toast.success('Comentário efetuado!');
                buscarComentarios(data.codigoQuestao);
            }
            else{
                toast.info('Erro ao comentar');
                toast.warn(response.data.message);
            }
        }).catch(() => {
            closeModalComentario();
            toast.error('Erro ao comentar!');
            return;
        });
    }

    async function deleteComentario(comentario){
        await api.delete('/ComentariosQuestoes?id=' + comentario)
        .then((response) => {
            if(response.data.success){
                toast.success('Excluído');
                buscarComentarios(questao?.Id);
            }
            else{
                toast.error('Erro ao excluir');
            }
        })
        .catch(() => {
            toast.error('Erro ao excluir');
        })
    }

    function GravaRespostaAvaliacao(codigoAvalioacao, codigoQuestao, codigoResposta){
        setLoadding(true);

        api.post('/RespostasAvaliacoes', {
            idAvaliacao: codigoAvalioacao,
            idQuestao: codigoQuestao,
            idResposta: codigoResposta
        }).then(response => {
            if(response.data.success){
                toast.success('Resposta armazenada!');
            }
            else
                toast.error('Erro ao armazenar resposta!');
            setLoadding(false);
        })
    }

    async function atualizaAssunto(){
        var data = {
            "CodigoQuestao": questao?.Id,
            "Assunto": assunto
        };

        setLoadding(true);

        await api.put(`/questoes/updateAssunto`, 
        data
        )
        .then((response) => {
            setLoadding(false);
            closeModalAssunto();
            closeModalSolicitacao();

            if(response.data.success){
                toast.success('Assunto alterado!');
                BuscarQuestaoById(questao?.Id);
            }
            else{
                toast.info('Erro ao alterar assunto');
                toast.warn(response.data.message);
            }
        }).catch(() => {
            closeModalComentario();
            toast.error('Erro ao alterar assunto!');
            return;
        });
    }

    if(loadding || !questao){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="global-pageContainer-left">
            <Modal
              isOpen={modalSolicitacao}
              onRequestClose={closeModalSolicitacao}
              style={style}
              contentLabel="Solicitação"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>O que deseja fazer?</h3>
                    </div>
                    <div className='separator separator--withMargins'></div>
                    <div className='global-buttonWrapper'>
                        <button className='global-button' onClick={buscaRespostaCorreta}>Visualizar resposta</button>
                        {
                            questao?.ativo == "1" ? 
                            <button className='global-button' onClick={solicitarRevisao}>Solicitar revisão da questão</button>
                            :
                            <></>
                        }
                        {
                            localStorage.getItem(Config.ADMIN) === '1' ?
                            <>
                                <button className='global-button' onClick={editaQuestao}>Editar questão</button>
                                <button className='global-button' onClick={() => revisar()}>Colocar questão como revisada</button>
                            </>
                            :
                            <></>
                        }
                        {
                            localStorage.getItem(Config.ADMIN) === '1' || localStorage.getItem(Config.ADMIN) === '1'?
                            <>
                                <button className='global-button' onClick={openModalAssunto}>Alterar Assunto</button>
                            </>
                            :
                            <></>
                        }
                    </div>
                </div>
            </Modal>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModalSolicitarRevisao}
              style={style}
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
              style={style}
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
              style={style}
              contentLabel="Example Modal"
            >
            
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3 dangerouslySetInnerHTML={createMarkup(textoResposta)}></h3>
                    </div>
                </div>
            </Modal>
            <Modal
              isOpen={modalComentarioIsOpen}
              onRequestClose={closeModalComentario}
              style={customStylesComentario}
              contentLabel="Comentário"
            >
                <div className='contextModal'>
                    <h3>Comentário:</h3>
                    <div className="separator separator--withMargins"></div>
                    <div className='bodymodalComentario'>
                        <textarea type='text' placeholder="Comentário" rows="10" value={comentario} onChange={(e) => setComentario(e.target.value)}/>
                    </div>
                    <div className='botoesModal'>
                        <button className='global-button global-fullW' onClick={fazComentario}>Comentar</button>
                    </div>
                </div>
            </Modal>
            <Modal
              isOpen={modalAssuntoIsOpen}
              onRequestClose={closeModalAssunto}
              style={customStylesAssunto}
              contentLabel="Comentário"
            >
                <div className='contextModal'>
                    <h3>Assunto:</h3>
                    <div className="separator separator--withMargins"></div>
                    <div className='bodymodalAssunto'>
                        <input type='text' placeholder="Assunto" value={assunto} onChange={(e) => setAssunto(e.target.value)}/>
                    </div>
                    <div className='botoesModal'>
                        <button className='global-button global-fullW' onClick={atualizaAssunto}>Alterar</button>
                    </div>
                </div>
            </Modal>
            <div className='opcoesQuestao'>
                <div className='total'>
                    {
                        filtro.includes('simulado') || filtro.includes('avaliacao') ? 
                        <></>
                        :
                        <button className='global-button global-button--transparent' onClick={ListagemProva}>Voltar</button>
                    }
                    <Tempo inicio={parseInt(localStorage.getItem(Config.TEMPO_PARAM))}/>
                </div>
                {
                    filtro.includes('simulado') || filtro.includes('avaliacao') ? 
                    <>
                    </>
                    :
                    <div className='opcaoVerificacao'>
                        <button className='global-button global-button--transparent' onClick={openModalSolicitacao}>Opções</button>
                    </div>
                }
            </div>

            <div className="separator separator--withMargins"></div>

            <div className='Materia'>
                <h2>Matéria: {questao?.materia}</h2>
                {
                    questao?.assunto ?
                    <h4>
                        Assunto: {questao?.assunto}
                    </h4>
                    :<></>
                }
                <h4>Prova: {questao?.prova?.nomeProva}</h4>
                <h4>Banca: {questao?.prova?.banca}</h4>
            </div>


            <div className="separator separator--withMargins"></div>
            
            <div className='descricaoQuestao'>
                {
                    questao?.anexosQuestoes?.length > 0 ?
                    <h4 dangerouslySetInnerHTML={createMarkupWithImages(questao?.campoQuestao, questao?.anexosQuestoes)}></h4>
                    :
                    <h4 dangerouslySetInnerHTML={createMarkup(questao?.campoQuestao)}></h4>
                }
                <div className='todasRespostas'>
                    {
                        questao?.respostasQuestoes?.map((item) => {
                            return(
                                <div key={item.Id} className='dados global-infoPanel'>
                                    <label className='respostaLabel'>
                                        <input type='radio' className='radioOption' name={'Radio_' + item.codigo} onClick={(e) => ValidaResposta(e, item.codigo)}/>
                                        {
                                            item.anexoResposta.length > 0 ? 
                                            <div id="imagemResposta">
                                                <img src={item.anexoResposta[0].link}/>
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
                <div className="separator separator--withMargins"></div>
            </div>
            {
                filtro.includes('simulado') || filtro.includes('avaliacao') ? 
                <></>
                :
                <div className='contextComentarios'>
                    {
                        Number.isInteger(parseInt(filtro)) || filtro.includes('codigoquestaohistorico') || filtro.includes('codigoquestaounica') ?
                        <></>
                        :
                        <div className='opcoesBotoesNavegacao'>
                            <div className='opcaoBotaoBefore'>
                                <button className='global-button' onClick={() => {BuscarProximaQuestao(true, false);}}>Questão anterior</button>
                            </div>
                            <div className='opcaoBotaoAfter'>
                                <button className='global-button' onClick={() => {BuscarProximaQuestao(false, true);}}>Próxima questão</button>
                            </div>
                        </div>
                    }
                    <div className='modalComentarios'>
                        <h2>Comentários✉️</h2>
                        <div className='comentarios global-infoPanel global-mt'>
                            {
                                comentarios?.map((comentario) => {
                                    return(
                                        <div className='comentario' id={comentario.codigo}>
                                            <sup>{comentario.nomeUsuario } - {montaData(comentario.created)} {comentario.canEdit ? <><AiOutlineDelete onClick={() => deleteComentario(comentario.codigo)}/></> : <></>}</sup> 
                                            <h4 dangerouslySetInnerHTML={createMarkup(comentario.comentario)}>
                                            </h4>
                                            <div className='separator separator--withMargins'></div>
                                        </div>
                                    )
                                })
                            }
                        <div className='opcaoVerificacao'>
                            <div onClick={openModalComentario} className='global-button global-button--transparent'><BsChatLeftDotsFill/>Deixar comentário</div>
                        </div>
                        </div>
                        
                    </div>
                </div>
            }
        </div>
    )
}

export default Questoes;