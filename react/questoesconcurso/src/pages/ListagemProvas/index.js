import './style.css';
import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Config from "../../config.json";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

function ListagemProvas(){
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(true);
    const[provas, setProvas] = useState([]);

    useEffect(() => {
        async function buscaProvas(){
            let url = '/BuscarProvas.php' + 
            (
                sessionStorage.getItem(Config.LOGADO) == null || sessionStorage.getItem(Config.LOGADO) === '0' ? 
                '' 
                : 
                '?codigousuario=' + sessionStorage.getItem(Config.CodigoUsuario)
            )
            await api.get(url)
            .then((response) => {
                if(response.data.Sucesso){
                    setProvas(response.data.lista);
                    setLoadding(false);
                }
                else{
                    navigate('/', {replace: true});
                    toast.warn('Erro ao buscar');    
                }
            })
            .catch(() => {
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar');
            })
        }

        setLoadding(true);

        buscaProvas();
    }, []);

    async function BaixarProva(codigoProva, prova){
        setLoadding(true);
        await api.get(`/BuscarArquivoProva.php?codigoProva=${codigoProva}`)
        .then((result) => {
            if(result.data.Sucesso){

                const link = document.createElement('a');
                link.href = result.data.Arquivo;
                link.setAttribute(
                    'download',
                    prova + '.pdf',
                );

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            }
            setLoadding(false);
        })
        .catch(() => {
            setLoadding(false);
        })
    }

    async function BaixarGabarito(codigoProva, prova){
        setLoadding(true);
        await api.get(`/BuscarArquivoGabarito.php?codigoProva=${codigoProva}`)
        .then((result) => {
            if(result.data.Sucesso){

                const link = document.createElement('a');
                link.href = result.data.Arquivo;
                link.setAttribute(
                    'download',
                    prova + ' - Gabarito.pdf',
                );

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            }
            setLoadding(false);
        })
        .catch(() => {
            setLoadding(false);
        })
    }

    function abrirQuestao(codigo){
        navigate('/listagemquestoes/' + codigo, {replace: true});
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }
    
    return(
        <div className='containerpage'>
            <h2>Provas</h2>
            <div className='provas'>
                {
                    provas.map((item) => {
                        return(
                            <div key={item.Codigo}>
                                <h4>
                                <b>Prova:</b> {item.Nomeprova}
                                <br/>
                                <b>Local de aplicação:</b> {item.Local}
                                <br/>
                                <b>Banca:</b> {item.Banca}
                                <br/>
                                <b>Ano de aplicação:</b> {item.Dataaplicacao}
                                <br/>
                                <b>Quantidade de questões:</b> {item.QuantidadeQuestoesTotal}
                                {
                                    sessionStorage.getItem(Config.LOGADO) == null || sessionStorage.getItem(Config.LOGADO) === '0'?
                                    <>
                                    </>
                                    :
                                    <>
                                    <br/>
                                    <b>Quantidade de questões resolvidas:</b> {item.QuantidadeQuestoesResolvidas}
                                    </>
                                }
                                <br/>
                                <a className='botaoBaixarArquivo' onClick={() => BaixarProva(item.Codigo, item.Nomeprova)}><CloudDownloadIcon/> Prova</a>
                                <br/>
                                <a className='botaoBaixarArquivo' onClick={() => BaixarGabarito(item.Codigo, item.Nomeprova)}><CloudDownloadIcon/> Gabarito</a>
                                </h4>
                                <button onClick={() => abrirQuestao(item.Codigo)}>Visualizar questões</button>
                                <br/>
                                <br/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ListagemProvas;