import './admin.css';
import api from '../../services/api.js';
import Config from './../../config.json';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

function Admin(){
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const[loadding, setLoadding] = useState(false);
    const[respostas, setRespostas] = useState([]);
    const[usuarios, setUsuarios] = useState([]);
    const[usuarioFiltro, setUsuarioFiltro] = useState([]);
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(7);

    async function buscaRespostas(page, usuario){
        
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }
        setLoadding(true);

        await api.get('/RespostasUsuaro/getHistory?page=' + page + '&quantity=' + quantityPerPage + '&userCode=' + usuario)
        .then((response) => {
            if(response.data.success){
                setRespostas(response.data.object);
                setQuantity(response.data.total);
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

    async function buscaUsuarios(){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get('/Usuarios')
        .then((response) => {
            if(response.data.success){
                var prov = [];
                response.data.object.forEach(element => {
                    prov.push({
                        value: element.id,
                        label: element.nome
                    })
                });
                setUsuarios(prov);
                setQuantity(response.data.total);
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

    useEffect(() => {
        setLoadding(true);

        buscaUsuarios();
    }, []);

    const handleUsuarios = (selectedOptions, event) => {
        setUsuarioFiltro(selectedOptions);

        buscaRespostas(page, selectedOptions.value);
    }

    function abreQuestao(codigoQuestao){
        navigate('/questoes/codigoquestaohistorico:' + codigoQuestao, {replace: true});
    }

    const handleChange = (event, value) => {
        setPage(value);
        setLoadding(true);
        buscaRespostas(value, usuarioFiltro.value);
      };

      function baixarBoletinDetalhado(){
        setLoadding(true);
        console.log(usuarioFiltro);
        api.get('/RespostasQuestoes/reportDetail?codigoUsuario=' + usuarioFiltro.value)
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                const link = document.createElement('a');
                link.href = response.data.object;
                link.download = 'Histórico - ' + localStorage.getItem(Config.Nome) + '.html';
                link.click();
            }
            else{
                toast.error('Histórico não encontrado');
            }
        })
        .catch((error) => {
            setLoadding(false);
            console.log(error);
            toast.error('Erro ao gerar o boletinho!');
        })
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="containerpage">
            <h1>Admin</h1>
            <div className='descricao'>
                <h3>Última respostas dos usuários:</h3>
                <div className='formUsuario'>
                    <div className='selectUsuario'>
                        <p>Usuário:</p>
                        <Select closeMenuOnSelect={false} components={animatedComponents} options={usuarios} onChange={handleUsuarios} style={{width: '100%'}}/>
                    </div>
                </div>
                <div className='respostasUsuarios'>
                    <p>
                        Baixar histórico detalhado: <a target="_blank" onClick={() => baixarBoletinDetalhado()}>📩</a>
                    </p>
                    <h3>
                        Histórico de questões respondidas por {usuarioFiltro.label}:
                    </h3>
                {   
                    respostas?.map((item, index) => {
                        return(
                            <div key={index} >
                                <h4>
                                    Prova: {item.nomeProva}📚
                                    <br/>
                                    Questão: {item.numeroQuestao}
                                    <br/>
                                    Resposta: {item.respostaCorreta === '1' ? "CORRETA🥳" : "INCORRETA😒"}
                                    <br/>
                                    Data resposta: {item.dataResposta?.replace('T', ' ')}
                                    <br/>
                                    <button className='global-button global-button--full-width' onClick={() => abreQuestao(item.codigoQuestao)}>Visualizar Questão✏️</button>
                                    <br/>
                                    <br/>
                                </h4>
                            </div>
                        )
                    })
                }
                {
                    <Stack spacing={4}>
                        <Pagination count={parseInt((quantity/quantityPerPage)+1)} page={page} color="primary" showFirstButton showLastButton onChange={handleChange}/>
                    </Stack>    
                }
                </div>
            </div>
        </div>
    )
}

export default Admin;