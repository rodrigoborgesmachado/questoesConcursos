import api from '../../services/api.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader.js';

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
        navigate('/questoes/avaliacao&' + id + '?avaliacao=' + id + '&page=0', { replace: true });
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

    async function baixarArquivo(codigo, nome, prova){
        setLoadding(true);
        let url = prova ? '/Avaliacao/downloadProva?codigo=' : '/Avaliacao/downloadGabarito?codigo=';
        url += codigo;

        await api.get(url)
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                const link = document.createElement('a');
                link.href = response.data.object;
                link.download = (prova ? 'Prova ' : 'Gabarito ') + nome.replace('/', '').replace('-', ' ') + '.html';
                link.click();
            }
            else{
                toast.error((prova ? 'Prova' : 'Gabarito') + ' não encontrada');
            }
        })
        .catch((error) => {
            setLoadding(false);
            console.log(error);
            toast.error('Erro ao gerar a prova!');
        })
    }

    if(loadding){
        return(
            <PacmanLoader/>
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
                    <h4 className='vis' onClick={() => baixarArquivo(avaliacao.Id, avaliacao.nome, true)}>
                        Baixar avaliação <DownloadIcon/>
                    </h4>
                    <h4 className='vis' onClick={() => baixarArquivo(avaliacao.Id, avaliacao.nome, false)}>
                        Baixar gabarito <DownloadIcon/>
                    </h4>
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
                    <button className='global-button global-button--full-width' onClick={() => abrirAvaliacao(avaliacao.Id)}>Iniciar Avaliacao</button>
                    <button className='global-button global-button--full-width' onClick={() => abrirRespostas(avaliacao.Id)}>Visualizar Minhas Respostas</button>
                </div>
            </div>
        </div>
    )
}

export default Avaliacao;