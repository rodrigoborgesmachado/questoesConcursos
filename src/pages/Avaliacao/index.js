import api from '../../services/api.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';

function Avaliacao(){
    const navigate = useNavigate();
    const{code} = useParams();
    const[loadding, setLoadding] = useState(true);

    const[avaliacao, setAvaliacao] = useState({});

    function BuscaAvaliacao(code){
        setLoadding(true);
        api.get(`/Avaliacao/getById?id=${code}`)
        .then(response => {
            setLoadding(false);
            if(response.data.success){
                setAvaliacao(response.data.object);
            }
            else{
                toast.error('Erro ao buscar dados da avaliação');
                navigate('/', {replace: true});
            }
        })
    }

    useEffect(() => {
        BuscaAvaliacao(code);
    }, [])

    function abrirAvaliacao(id){
        navigate('/questoes/avaliacao&' + id, { replace: true });
    }

    function abrirRespostas(id){
        navigate('/resultadoAvaliacao/' + id, {replace: true});
    }

    function voltar(){
      navigate('/avaliacoes', {replace: true});
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
                    <h4>Nota total: {avaliacao.notaTotal}</h4>
                    {
                        avaliacao.orientacao ? 
                        <>
                            <h3 className='center-text'>Instruções para prova: </h3>
                            <h4 dangerouslySetInnerHTML={createMarkup(avaliacao.orientacao.replaceAll('\n', '<br>'))}></h4>
                        </>
                        :<></>
                    }
                </div>
                <div className="separator separator--withMargins"></div>
                <div className='opcoes-botoes'>
                    <button className='global-button global-button--full-width' onClick={() => abrirAvaliacao(avaliacao.id)}>Iniciar Avaliacao</button>
                    <button className='global-button global-button--full-width' onClick={() => abrirRespostas(avaliacao.id)}>Visualizar Minhas Respostas</button>
                </div>
            </div>
        </div>
    )
}

export default Avaliacao;