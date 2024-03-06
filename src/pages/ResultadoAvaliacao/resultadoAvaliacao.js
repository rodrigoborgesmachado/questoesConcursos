import api from '../../services/api.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import { Table } from 'react-bootstrap';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Config from './../../config.json';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import {abreQuestao} from './../../services/functions.js'

function ResultadoAvaliacao(){
    const navigate = useNavigate();
    const{code} = useParams();
    const[loadding, setLoadding] = useState(true);
    const animatedComponents = makeAnimated();
    const searchParams = new URLSearchParams(window.location.search);

    const[avaliacao, setAvaliacao] = useState({});
    const[respostas, setRespostas] = useState([]);
    const[usuarios, setUsuarios] = useState([]);
    const[selectedUsuarios, setSelectedUsuarios] = useState([]);

    function BuscaUsuarios(code){
        setLoadding(true);
        api.get(`/RespostasAvaliacoes/getUsuarios?avaliacao=${code}`)
        .then(response => {
            setLoadding(false);
            if(response.data.success){

                var t = [];
                response.data.object.forEach(element => {
                    t.push({
                        value: element.email,
                        label: element.nome
                    })
                });

                setUsuarios(t);
            }
            else{
                toast.error('Erro ao buscar usuários');
                navigate('/', {replace: true});
            }
        })
        .catch(() => {
            toast.error('Erro ao buscar usuários');
            navigate('/', {replace: true});
        })
    }

    function BuscaRespostas(code, email){
        setLoadding(true);
        api.get(`/RespostasAvaliacoes/getByAvaliacao?avaliacao=${code}` + (email != '' ? '&email=' + email: ''))
        .then(response => {
            setLoadding(false);
            if(response.data.success){
                setRespostas(response.data.object);
            }
            else{
                toast.error('Erro ao buscar repostas');
                navigate('/', {replace: true});
            }
        })
        .catch(() => {
            toast.error('Erro ao buscar repostas');
            navigate('/', {replace: true});
        })
    }

    function BuscaAvaliacao(code){
        setLoadding(true);
        api.get(`/Avaliacao/getById?id=${code}`)
        .then(response => {
            if(response.data.success){
                setAvaliacao(response.data.object);
                BuscaRespostas(code, '');
            }
            else{
                setLoadding(false);
                toast.error('Erro ao buscar dados da avaliação');
                navigate('/', {replace: true});
            }
        })
        .catch(() => {
            toast.error('Erro ao buscar dados da avaliação');
            navigate('/', {replace: true});
        })
    }

    useEffect(() => {
        BuscaAvaliacao(code);
        if(localStorage.getItem(Config.ADMIN) === '2')
            BuscaUsuarios(code);
    }, [])

    function questoesCertas(){
        let retorno = 0;

        for(var i = 0; i< respostas.length; i++){
            retorno += (respostas[i].resposta.certa == '1' ? 1 : 0);
        }

        return retorno;
    }

    function voltar(){
        if(searchParams.get('page') && searchParams.get('page') == "1"){
            navigate('/listagemminhasavaliacoes', {replace: true});
        }
        else{
            navigate('/avaliacoes/' + code, {replace: true});
        }

    }

    const handleChangeSelect = (selectedOptions, event) => {
        console.log(selectedOptions);
        setSelectedUsuarios(selectedOptions.label);
        BuscaRespostas(code, selectedOptions.value);
    }

    function createMarkup(text) { 
        return {__html: text}; 
    };

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="containerpage global-fullW">
            <div className='global-infoPanel'>
                <div className='total'>
                    <button className='global-button global-button--transparent' onClick={voltar}>Voltar</button>
                </div>
                <div className="separator separator--withMargins"></div>
                <div className='dadosAvaliacao'>
                    <h3 className='center-text'>{avaliacao.nome}</h3>
                    <h4>Professor: {avaliacao.usuario.nome}</h4>
                    <h4>Instituição: {avaliacao.usuario.instituicao}</h4>
                    <h4>Quantidade de questões: {avaliacao.questoesAvaliacao.length}</h4>
                    <h4>Valor avaliação: {avaliacao.notaTotal}</h4>
                    <h4>Nota Total: {questoesCertas()}</h4>
                    {
                        avaliacao.orientacao ? 
                        <>
                            <h3 className='center-text'>Instruções para prova: </h3>
                            <h4 dangerouslySetInnerHTML={createMarkup(avaliacao.orientacao.replaceAll('\n', '<br><br>'))}></h4>
                        </>
                        :<></>
                    }
                </div>
                {
                    localStorage.getItem(Config.ADMIN) === '2' ?
                    <div className='alunosResponderamAvaliacao'>
                        <div className="separator separator--withMargins"></div>
                        <h4>Alunos que responderam a avaliação:</h4>
                        <Select className='select-item' closeMenuOnSelect={false} components={animatedComponents} options={usuarios} value={selectedUsuarios} onChange={handleChangeSelect} />
                    </div>
                    :
                    <>
                    </>
                }
                <div className="separator separator--withMargins"></div>
                {
                    localStorage.getItem(Config.ADMIN) === '2' ?
                        <h3 className='center-text'>Respostas - {selectedUsuarios}</h3>
                        :
                        <h3 className='center-text'>Respostas</h3>
                }
                <Table>
                    <thead>
                        <tr>
                            <th>
                                Nº Questão - Avaliação
                            </th>
                            <th>
                                Matéria
                            </th>
                            <th>
                                Prova
                            </th>
                            <th>
                                Resposta
                            </th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            respostas.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td>
                                            <h4>
                                                {(index+1)}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.questao.materia}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.questao.prova.nomeProva}
                                            </h4>
                                        </td>
                                        <td>
                                            {item.resposta.certa == "1" ? 'Correta✅' : 'Errado❌'}
                                        </td>
                                        <td className='option'>
                                            <h4 onClick={() => abreQuestao(item.questao.id)}>
                                                <VisibilityIcon className='vis'/>
                                            </h4>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default ResultadoAvaliacao;