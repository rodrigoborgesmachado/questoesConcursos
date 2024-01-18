import './style.css';
import { useState, useEffect } from 'react';
import Config from '../../config.json';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import Modal from 'react-modal';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      width: '90%',
      height: '80%',
      border: 0,
      background: '#424242',
      marginRight: '-50%',
      'border-radius': '5px',
      transform: 'translate(-50%, -50%)',
    },
  };


function CadastraQuestao(){
    const navigate = useNavigate();
    const{filtro} = useParams();
    const{numero} = useParams();
    const{questaoCode} = useParams();
    const[contadorImagem, setContadorImagem] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const[questao, setQuestao] = useState({
        campoQuestao: '<b>Questão ' + (numero > 10 ? numero : '0' + numero) + '</b><br><br>',
        observacaoQuestao: '',
        materia: '',
        codigoProva: filtro,
        numeroQuestao: numero,
        ativo: '1',
        updatedOn: '2023-05-07',
        respostasUsuarios:[],
        respostasQuestoes: [
            {
                textoResposta:'',
                certa: '',
                anexoResposta: [
                    {
                        anexo: ''
                    }
                ]
            },
            {
                textoResposta:'',
                certa: '',
                anexoResposta: [
                    {
                        anexo: ''
                    }
                ]
            },
            {
                textoResposta:'',
                certa: '',
                anexoResposta: [
                    {
                        anexo: ''
                    }
                ]
            },
            {
                textoResposta:'',
                certa: '',
                anexoResposta: [
                    {
                        anexo: ''
                    }
                ]
            },
            {
                textoResposta:'',
                certa: '',
                anexoResposta: [
                    {
                        anexo: ''
                    }
                ]
            }
        ],
        anexosQuestoes:[
            {
                anexo: ''
            }
        ]
    });
    const[loadding, setLoadding] = useState(false);

    async function buscaQuestao(codigo){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get('/Questoes/getById?id=' + codigo)
        .then((response) => {
            if(response.data.success){
                for(var i = 0; i < response.data.object.respostasQuestoes.length;i++){
                    response.data.object.respostasQuestoes[i].certa = response.data.object.respostasQuestoes[i].certa == '1';
                }
                setQuestao(response.data.object);

                setLoadding(false);
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar questão');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar questão');
        })
    }
    
    useEffect(() => {
        if(questaoCode != undefined){
            setLoadding(true);
            buscaQuestao(questaoCode);
        }
        else{
            setLoadding(false);
        }
    }, []);

    function openModal() {
        setModalIsOpen(true);
    }
    
    function closeModal() {
        setModalIsOpen(false);
    }

    function adicionaResposta(){
        setQuestao({
          ...questao,
          respostasQuestoes: [
            ...questao.respostasQuestoes,
            { textoResposta: "", certa: false, anexoResposta: [] },
          ],
        });
    }

    function removeResposta(index){
        setQuestao({
            ...questao,
            respostasQuestoes: [
                ...questao.respostasQuestoes.slice(0, index),
                ...questao.respostasQuestoes.splice(index + 1)
            ],
          });
    }

    async function confirmaFormulario(){

        var questaoPost = questao;

        if(questao.respostasQuestoes.filter(r => r.certa).length == 0){
            toast.warn('Nenhuma resposta foi marcada como certa!');
            return;
        }

        (questaoPost.respostasQuestoes).forEach(element => {
            element.certa = element.certa ? '1' : '2'
        });

        if(questaoPost.materia == ''){
            toast.warn('Matéria não foi preenchida!');
            return;
        }

        if(questao.numeroQuestao == ''){
            toast.warn('Número da questão não foi preenchido!');
            return;
        }

        
        setLoadding(true);

        if(questaoCode != undefined){
            await api.put(`/Questoes`, 
            questaoPost
            )
            .then((response) => {
                if(response.data.success){
                    toast.success('Questão editada com sucesso!');
                    navigate('/questoes/codigoquestaolistagem:' + questaoCode, {replace: true});
                }
                else{
                    toast.info('Erro ao editar');
                    toast.warn(response.data.message);
                }
                setLoadding(false);
            }).catch(() => {
                setLoadding(false);
                toast.error('Erro ao criar a questão!');
                return;
            });
        }
        else{
            await api.post(`/Questoes`, 
            questaoPost
            )
            .then((response) => {
                if(response.data.success){
                    toast.success('Questão cadastrada com sucesso!');
                    navigate('/prova/' + filtro, {replace: true});
                }
                else{
                    toast.info('Erro ao cadastrar');
                    toast.warn(response.data.message);
                }
                setLoadding(false);
            }).catch(() => {
                setLoadding(false);
                toast.error('Erro ao criar a questão!');
                return;
            });
        }
    }

    function createMarkup(text) { return {__html: text}; };

    function createMarkupWithImages(text, anexos){
        let temp = text;
        
        for(let i = 0; i< anexos?.length; i++){
            temp = temp.replace(`<img src="#" alt="Anexo" id="divAnexo${i}"/>`, `<img src=\"${anexos[i].anexo}\" alt=\"Anexo\" id=\"divAnexo${i}\"/>`);
        }

        return createMarkup(temp);
    }

    function voltarListagemQuestoes(){
        navigate('/prova/' + filtro, { replace: true });
    }

    if(localStorage.getItem(Config.LOGADO) == null || localStorage.getItem(Config.LOGADO) === '0' ){
        navigate('/login', {replace: true});
    }

    if(localStorage.getItem(Config.ADMIN) != '1'){
        navigate('/', {replace: true});
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }
    else{
    }

    return(
        <div className="global-pageContainer-left">
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Questão"
            >
                <div className='contextModal'>
                    <div className='Materia'>
                        <h2>Matéria: {questao?.materia}</h2>
                    </div>
                    <br/>
                    <br/>
                    <div className='descricaoQuestao'>
                        {
                            questao.anexosQuestoes?.length > 0 ?
                            <h4 dangerouslySetInnerHTML={createMarkupWithImages(questao.campoQuestao, questao.anexosQuestoes)}></h4>
                            :
                            <h4 dangerouslySetInnerHTML={createMarkup(questao.campoQuestao)}></h4>
                        }
                        <br/>
                        <br/>
                        <div className='todasRespostas'>
                            {
                                questao.respostasQuestoes.map((item) => {
                                    return(
                                        <div key={item.codigo} className='respostas'>
                                            <label className='respostaLabel'>
                                                <input type='radio' className='radioOption' checked={item.certa ?? true} name={'Radio_' + item.codigo} />
                                                {
                                                    <>
                                                    {
                                                        item.anexoResposta.length > 0 && item.anexoResposta[0].anexo != ''?
                                                        <div id="imagemResposta">
                                                            <img src={item.anexoResposta[0]?.anexo}/>
                                                        </div>
                                                        :
                                                        <h4 dangerouslySetInnerHTML={createMarkup(item.textoResposta)} className='descricaoResposta'></h4>
                                                    }
                                                    </>
                                                }
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </Modal>
            <div className="global-infoPanel">
                <div className='total'>
                    <button className='global-button global-button--transparent' onClick={voltarListagemQuestoes}>Voltar</button>
                </div>
                <h3>
                  Descrição:
                </h3>
                <div className='campoQuestao'>
                    <textarea
                      type="text"
                      placeholder="Descrição da questão" 
                      required 
                      rows="35"
                      value={questao.campoQuestao}
                      onChange={(event) =>
                        setQuestao({ ...questao, campoQuestao: event.target.value })
                      }
                    />
                    <div className='botaoQuestao'>
                        <button className='global-button global-button--transparent' onClick={
                            () => 
                                setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<b></b>' })
                        }
                        > 
                            Negrito
                        </button>
                        <button className='global-button global-button--transparent' onClick={
                            () => 
                                setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<i></i>' })
                        }
                        > 
                            Itálico
                        </button>
                        <button className='global-button global-button--transparent' onClick={
                            () => 
                                setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<br>' })
                        }
                        > 
                            Saltar linha
                        </button>
                        <button className='global-button global-button--transparent' onClick={
                            () => {
                                setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<img src="#" alt="Anexo" id="divAnexo' + contadorImagem + '"/>' });
                                setContadorImagem(contadorImagem+1);
                            }
                        }
                        > 
                            Add Imagem
                        </button>
                        <button className='global-button global-button--transparent' onClick={
                            () => {
                                setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<span>&#8730;</span>' });
                                setContadorImagem(contadorImagem+1);
                            }
                        }
                        > 
                            Add raiz quadrada
                        </button>
                        <button className='global-button global-button--transparent' onClick={
                            () => {
                                setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<span>&#960;</span>' });
                                setContadorImagem(contadorImagem+1);
                            }
                        }
                        > 
                            Add Pi
                        </button>
                        <button className='global-button global-button--transparent' onClick={
                            () => {
                                setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<sup></sup>' });
                                setContadorImagem(contadorImagem+1);
                            }
                        }
                        > 
                            Add elevação (sup)
                        </button>
                        <button className='global-button global-button--transparent' onClick={
                            () => {
                                setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<sub></sub>' });
                                setContadorImagem(contadorImagem+1);
                            }
                        }
                        > 
                            Add citação (sub)
                        </button>
                    </div>
                </div>
                <div className='camposQuestaoAdd'>
                    <h3>
                        Observação:
                    </h3>
                    <input
                        type="text"
                        value={questao.observacaoQuestao}
                        onChange={
                            (event) =>
                            setQuestao({
                              ...questao,
                              observacaoQuestao: event.target.value
                            })
                        }
                    />
                    <h3>
                        Matéria:
                    </h3>
                    <input
                        type="text"
                        value={questao.materia}
                        onChange={
                            (event) =>
                            setQuestao({
                              ...questao,
                              materia: event.target.value
                            })
                        }
                    />
                    <h3>
                        Número da questão:
                    </h3>
                    <input
                        type="text"
                        value={questao.numeroQuestao}
                        onChange={
                            (event) =>
                            setQuestao({
                              ...questao,
                              numeroQuestao: event.target.value
                            })
                        }
                    />
                    <h3>
                        Anexos da questão:
                    </h3>
                    <input
                        type="file"
                        multiple="multiple"
                        className='global-button global-button--transparent'
                        onInput=
                        {async (event) =>
                            {
                                var files = event.target.files;
                                let lista = [];
                                for(var i = 0; i < files.length; i++){
                                    let reader = new FileReader();
                                    reader.onload = function (){
                                        lista.push(
                                            {
                                                anexo: reader.result
                                            }
                                        );
                                    }
                                    reader.onerror = function(error){
                                        alert(error);
                                    }
                                    await reader.readAsDataURL(files[i]);
                                }

                                setQuestao({
                                    ...questao,
                                    anexosQuestoes: lista
                                });
                            }
                        }
                    />
                </div>
                <h3>
                  Respostas:
                </h3>
                <div className='respostasCadastro'>
                    {questao.respostasQuestoes.map((option, index) => (
                        <div  key={index}>
                            <label>
                                <div className='sameLine'>
                                    <h3>
                                    Resposta {index + 1}: 
                                    </h3>
                                    <button  type="button" className='global-button global-button--transparent' onClick={() => removeResposta(index)}>Remove</button>
                                </div>
                            <input
                                type="text"
                                value={option.textoResposta}
                                onChange={(event) =>{
                                    if(questaoCode != undefined){
                                        setQuestao({
                                          ...questao,
                                          respostasQuestoes: [
                                            ...questao.respostasQuestoes.slice(0, index),
                                            {
                                              codigo: questao.respostasQuestoes[index].codigo,
                                              textoResposta: event.target.value,
                                              certa: questao.respostasQuestoes[index].certa,
                                              anexoResposta: questao.respostasQuestoes[index].anexoResposta,
                                            },
                                            ...questao.respostasQuestoes.slice(index + 1),
                                          ],
                                        })
                                    }
                                    else{
                                        setQuestao({
                                            ...questao,
                                            respostasQuestoes: [
                                              ...questao.respostasQuestoes.slice(0, index),
                                              {
                                                textoResposta: event.target.value,
                                                certa: questao.respostasQuestoes[index].certa,
                                                anexoResposta: questao.respostasQuestoes[index].anexoResposta,
                                              },
                                              ...questao.respostasQuestoes.slice(index + 1),
                                            ],
                                          })
                                    }
                                }}
                            />
                            </label>
                            <label>
                                <div className='respostaCorretaOption'>
                                    <h3>
                                        Resposta correta:
                                    </h3>
                                    <input
                                        type="checkbox"
                                        checked={option.certa}
                                        onChange={(event) =>
                                            setQuestao({
                                              ...questao,
                                              respostasQuestoes: [
                                                ...questao.respostasQuestoes.slice(0, index),
                                                {
                                                  certa: event.target.checked,
                                                  textoResposta: questao.respostasQuestoes[index].textoResposta,
                                                  anexoResposta: questao.respostasQuestoes[index].anexoResposta,
                                                },
                                                ...questao.respostasQuestoes.slice(index + 1),
                                              ],
                                            })
                                          }
                                    />
                                </div>
                            </label>
                            <label>
                                <h3>
                                    Anexos da resposta:
                                </h3>
                                <input
                                    type='file'
                                    className='global-button global-button--transparent'
                                    onInput=
                                    {(event) =>
                                        {
                                            var reader = new FileReader();
                                            reader.onload = function (){
                                                setQuestao({
                                                    ...questao,
                                                    respostasQuestoes: [
                                                      ...questao.respostasQuestoes.slice(0, index),
                                                      {
                                                        certa: questao.respostasQuestoes[index].certa,
                                                        textoResposta: questao.respostasQuestoes[index].textoResposta,
                                                        anexoResposta:[
                                                            ...questao.respostasQuestoes[index].anexoResposta.slice(0, questao.respostasQuestoes[index].anexoResposta.length-1),
                                                            {
                                                                anexo: reader.result,
                                                            },
                                                            ...questao.respostasQuestoes[index].anexoResposta.slice(questao.respostasQuestoes[index].anexoResposta.length)
                                                        ]
                                                      },
                                                      ...questao.respostasQuestoes.slice(index + 1),
                                                    ],
                                                  })
                                            }
                                            reader.onerror = function(error){
                                                alert(error);
                                            }
                                            var file = event.target.files;
                                        
                                            for(var i = 0; i < file.length; i++){
                                                reader.readAsDataURL(file[i]);
                                            }
                                        }
                                    }
                                />
                            </label>
                            <hr/>
                        </div>
                    ))}
                </div>
                <button type="button" 
                    className='global-button global-button--transparent'
                    onClick={adicionaResposta}>
                  Adicionar Resposta
                </button>
                <div className='addQuestao'>
                    <button 
                        className='global-button global-button--transparent'
                        onClick={openModal}> 
                        Testar Layout
                    </button>
                    <button 
                        className='global-button global-button'
                        onClick={confirmaFormulario}> {questaoCode != undefined ? <>Editar Questão</> : <>Cadastrar Questão</>}</button>
                </div>
                
            </div>
        </div>
    )
}

export default CadastraQuestao;