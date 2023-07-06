import './style.css';
import { useState } from 'react';
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
    const[contadorImagem, setContadorImagem] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const[questao, setQuestao] = useState({
        campoQuestao: '',
        observacaoQuestao: '',
        materia: '',
        codigoProva: filtro,
        numeroQuestao: '',
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

    function openModal() {
        setModalIsOpen(true);
    }
    
    function closeModal() {
        setModalIsOpen(false);
    }

    function adicionaQuestao(){
        setQuestao({
          ...questao,
          respostasQuestoes: [
            ...questao.respostasQuestoes,
            { textoResposta: "", certa: false },
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

    function createMarkup(text) { return {__html: text}; };

    function createMarkupWithImages(text, anexos){
        let temp = text;
        
        for(let i = 0; i< anexos.length; i++){
            temp = temp.replace(`<img src="#" alt="Anexo" id="divAnexo${i}"/>`, `<img src=\"${anexos[i].anexo}\" alt=\"Anexo\" id=\"divAnexo${i}\"/>`);
        }

        return createMarkup(temp);
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
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }
    else{
    }

    return(
        <div className="containerpage">
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
                            questao.anexosQuestoes.length > 0 ?
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
                                                {console.log(item)}
                                                <input type='radio' className='radioOption' checked={item.certa ?? true} name={'Radio_' + item.codigo} />
                                                {
                                                    <>
                                                    {
                                                        item.anexoResposta[0].anexo != '' ?
                                                        <div id="imagemResposta">
                                                            <img src={item.anexoResposta[0].anexo}/>
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
            <div className="cadastroDeQuestao">
                <h3>
                  Descrição:
                </h3>
                <div className='campoQuestao'>
                <br/>
                <textarea
                  type="text"
                  placeholder="Descrição da questão" 
                  required 
                  rows="30"
                  value={questao.campoQuestao}
                  onChange={(event) =>
                    setQuestao({ ...questao, campoQuestao: event.target.value })
                  }
                  />
                <div className='botaoQuestao'>
                    <button onClick={
                        () => 
                            setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<b></b>' })
                    }
                    > 
                        Negrito
                    </button>
                    <button onClick={
                        () => 
                            setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<i></i>' })
                    }
                    > 
                        Itálico
                    </button>
                    <button onClick={
                        () => 
                            setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<br>' })
                    }
                    > 
                        Saltar linha
                    </button>
                    <button onClick={
                        () => {
                            setQuestao({ ...questao, campoQuestao: questao.campoQuestao + '<img src="#" alt="Anexo" id="divAnexo' + contadorImagem + '"/>' });
                            setContadorImagem(contadorImagem+1);
                        }
                    }
                    > 
                        Add Imagem
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
                    <br/>
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
                    <br/>
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
                    <br/>
                    <h3>
                        Anexos da questão:
                    </h3>
                    <input
                        type="file"
                        multiple="multiple"
                        onInput=
                        {(event) =>
                            {
                                var reader = new FileReader();
                                reader.onload = function (){
                                    setQuestao({
                                        ...questao,
                                        anexosQuestoes: [
                                          ...questao.anexosQuestoes.slice(0, questao.anexosQuestoes.length-1),
                                          {
                                            anexo: reader.result
                                          },
                                          ...questao.anexosQuestoes.slice(questao.anexosQuestoes.length),
                                        ],
                                      });
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
                </div>
                <br/>
                <br/>
                <br/>
                <br/>
                <h3>
                  Respostas:
                </h3>
                <div className='respostasCadastro'>
                    {questao.respostasQuestoes.map((option, index) => (
                        <div  key={index}>
                            <label>
                                <h3>
                                Resposta {index + 1}:
                            </h3>
                            <input
                                type="text"
                                value={option.textoResposta}
                                onChange={(event) =>
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
                <div className='addQuestao'>
                    <button type="button" 
                    onClick={adicionaQuestao}>
                      Adicionar Resposta
                    </button>
                </div>
                <br />
                <br />
                <button onClick={openModal}> 
                    Testar Layout
                </button>
                <button onClick={confirmaFormulario}>Cadastrar Questão</button>
            </div>
        </div>
    )
}

export default CadastraQuestao;