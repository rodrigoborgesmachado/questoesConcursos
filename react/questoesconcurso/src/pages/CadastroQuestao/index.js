import './style.css';
import { useState } from 'react';
import Config from '../../config.json';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';

function CadastraQuestao(){
    const navigate = useNavigate();
    const{filtro} = useParams();
    const[contadorImagem, setContadorImagem] = useState(0);

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
        setLoadding(true);

        var questaoPost = questao;

        (questaoPost.respostasQuestoes).forEach(element => {
            element.certa = element.certa ? '1' : '2'
        });

        await api.post(`/Questoes`, 
        questaoPost
        )
        .then((response) => {
            if(response.data.success){
                toast.success('Questão cadastrada com sucesso!');
                navigate('/listagemquestoes/' + filtro, {replace: true});
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

    if(localStorage.getItem(Config.LOGADO) == null || localStorage.getItem(Config.LOGADO) === '0' ){
        navigate('/', {replace: true});
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
                            setQuestao({ ...questao, campoQuestao: questao.campoQuestao + "<img src='#' alt='Anexo' id='divAnexo`" + contadorImagem + "`'/>" });
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
                <div className='respostas'>
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
                                    multiple="multiple"
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
                <button onClick={confirmaFormulario}>Cadastrar Questão</button>
            </div>
        </div>
    )
}

export default CadastraQuestao;