import './style.css';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import {toast} from 'react-toastify';
import api from '../../services/api.js';
import { useParams, useNavigate } from 'react-router-dom';
import { BsFunnelFill, BsFileEarmarkPlusFill } from "react-icons/bs";
import Config from './../../config.json';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Modal from 'react-modal';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        border: 0,
        background: '#424242',
        marginRight: '-50%',
        'border-radius': '5px',
        transform: 'translate(-50%, -50%)',
        width: '50%'
    },
};

const filtroBanca=1;
const filtroProva=2;
const filtroMateria=3;
const filtroAssuntos=4;
function ListagemQuestoes(){
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const animatedComponents = makeAnimated();

    const[loadding, setLoadding] = useState(true);
    const{filtro} = useParams();
    const[questoes, setQuestoes] = useState([]);
    const[prova, setProva] = useState({});
    const [page, setPage] = useState(searchParams.get('page') ? searchParams.get('page') : 1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(10);
    const [modalFiltroIsOpen, setModalFiltroIsOpen] = useState(false);

    const [bancas, setBancas] = useState([]);
    const [selectedBancas, setSelectedBancas] = useState(localStorage.getItem(Config.filtroBancasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroBancasSelecionadas)) : []);
    const [materias, setMaterias] = useState([]);
    const [selectedMaterias, setSelectedMaterias] = useState(localStorage.getItem(Config.filtroMateriasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroMateriasSelecionadas)) : []);
    const [assuntos, setAssuntos] = useState([]);
    const [selectedAssuntos, setSelectedAssuntos] = useState(localStorage.getItem(Config.filtroAssuntosSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroAssuntosSelecionadas)) : []);
    const [provas, setProvas] = useState([]);
    const [selectedProvas, setSelectedProvas] = useState(localStorage.getItem(Config.filtroProvasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroProvasSelecionadas)) : []);

    async function openModalFiltro() {
        setLoadding(true);

        await buscaDadosFiltro(filtroBanca);
        await buscaDadosFiltro(filtroProva);
        await buscaDadosFiltro(filtroMateria);
        await buscaDadosFiltro(filtroAssuntos);

        setLoadding(false);

        setModalFiltroIsOpen(true);
    }

    function closeModalFiltro() {
        setModalFiltroIsOpen(false);
    }

    useEffect(() => {
        if(modalFiltroIsOpen){
            buscaDadosFiltro(filtroBanca);
            buscaDadosFiltro(filtroMateria);
            buscaDadosFiltro(filtroAssuntos);
            localStorage.setItem(Config.filtroProvasSelecionadas, JSON.stringify(selectedProvas));
        }
    }, [selectedProvas]);

    useEffect(() => {
        if(modalFiltroIsOpen){
            buscaDadosFiltro(filtroProva);
            buscaDadosFiltro(filtroMateria);
            buscaDadosFiltro(filtroAssuntos);
            localStorage.setItem(Config.filtroBancasSelecionadas, JSON.stringify(selectedBancas));
        }
    }, [selectedBancas]);

    useEffect(() => {
        if(modalFiltroIsOpen){
            buscaDadosFiltro(filtroBanca);
            buscaDadosFiltro(filtroProva);
            buscaDadosFiltro(filtroAssuntos);
            localStorage.setItem(Config.filtroMateriasSelecionadas, JSON.stringify(selectedMaterias));
        }
    }, [selectedMaterias]);

    useEffect(() => {
        if(modalFiltroIsOpen){
            buscaDadosFiltro(filtroBanca);
            buscaDadosFiltro(filtroProva);
            buscaDadosFiltro(filtroMateria);
            localStorage.setItem(Config.filtroAssuntosSelecionadas, JSON.stringify(selectedAssuntos));
        }
    }, [selectedAssuntos]);

    async function buscaProva(){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get(filtro ? `/Prova/getById?id=${filtro}` : `/Prova/getById?id=-1`)
        .then((response) => {
            if(response.data.success){
                setProva(response.data.object);
                buscaQuestoes(page);
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

    async function buscaQuestoesFiltrando(){
        setPage(1);
        await buscaQuestoes(1);
        closeModalFiltro();
    }

    async function buscaQuestoes(page){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get(filtro ? `/Questoes/pagged?page=${page}&quantity=${quantityPerPage}&anexos=false&codigoProva=${filtro}` : `/Questoes/pagged?page=${page}&quantity=${quantityPerPage}&anexos=false` + montaBusca())
        .then((response) => {
            if(response.data.success){
                if(filtro){
                    setQuestoes(response.data.object.sort((a, b) => parseInt(a.numeroQuestao) - parseInt(b.numeroQuestao)));
                }
                else{
                    setQuestoes(response.data.object);
                }
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

        if(filtro){
            buscaProva();
        }
        else{
            buscaQuestoes(page);
        }
    }, [loadding])

    function abreQuestao(codigoQuestao){
        navigate((filtro ? '/questoes/codigoquestaolistagem:': '/questoes/codigoquestaolistagemsemprova:') + codigoQuestao + '?page=' + page, {replace: true});
    }

    function editaQuestao(codigoQuestao){
        navigate('/cadastraQuestao/' + filtro + '/1/' + codigoQuestao, {replace: true});
    }

    function addQuestao(){
        var proximoNumero = 1;

        if(questoes.length > 1)
            proximoNumero = questoes[questoes?.length -1].numeroQuestao + 1;

        navigate('/cadastraQuestao/' + filtro + '/' + proximoNumero, {replace: true});
    }

    function voltarListagemProva(){
        var page = localStorage.getItem(Config.PaginaListagem) == null ? '1' : localStorage.getItem(Config.PaginaListagem);
        navigate('/listagemprovas/' + page, {replace: true});
    }

    const handleChange = (event, value) => {
        setPage(value);
        setLoadding(true);
        buscaQuestoes(value);
    };

    async function AtualizaStatus(id, status){
        setLoadding(true);
        let url = '/Prova/updateStatus?id=' +  id + '&active=' + (status == '0' ? 'true' : 'false');

        await api.put(url)
        .then((response) => {
            setLoadding(false);
            if(response.data.success){
                toast.success('Atualizado com sucesso!');
                buscaProva();
            }
            else{
                toast.error('Não foi possível atualizar');
            }
        })
        .catch((error) => {
            setLoadding(false);
            console.log(error);
            toast.error('Não foi possível atualizar');
        })
    }

    const handleChangeSelectProva = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                codigoProva: item.value
            }
            );
        })

        setSelectedProvas(selectedOptions);
    }

    const handleChangeSelectMateria = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                materia: item.value
            }
            );
        })

        setSelectedMaterias(selectedOptions);
    }

    const handleChangeSelectBanca = async (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                banca: item.value
            }
            );
        })

        setSelectedBancas(selectedOptions);
    }

    const handleChangeSelectAssunto = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                materia: item.value
            }
            );
        })

        setSelectedAssuntos(selectedOptions);
    }

    function montaBusca(){
        var retorno = '';

        if(selectedProvas.length > 0){
            retorno += "&provas="
            selectedProvas.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        if(selectedMaterias.length > 0){
            retorno += "&materias="
            selectedMaterias.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        if(selectedBancas.length > 0){
            retorno += "&bancas="
            selectedBancas.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        if(selectedAssuntos.length > 0){
            retorno += "&assuntos="
            selectedAssuntos.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        return retorno;
    }

    async function buscaDadosFiltro(tipo){
        let url = '';

        if(tipo == filtroBanca){
            url = '/Prova/GetAllBancas';
        }
        else if(tipo == filtroProva){
            url = '/Prova/GetAllProvasName';
        }
        else if(tipo == filtroMateria){
            url = '/Prova/GetAllMaterias';
        }
        else{
            url = '/Prova/GetAllAssuntos';
        }

        await api.get(url + '?1=1' + montaBusca())
        .then((response) => {
            if(response.data.success){
                var t = [];
                response.data.object.forEach(element => {
                    t.push({
                        value: element,
                        label: element
                    })
                });

                if(tipo == filtroBanca){
                    setBancas(t);
                }
                else if(tipo == filtroProva){
                    setProvas(t);
                }
                else if(tipo == filtroMateria){
                    setMaterias(t);
                }
                else{
                    setAssuntos(t);
                }
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar filtros');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar filtros');
        })
    }

    async function limparFiltro(){
        setSelectedAssuntos([]);
        setSelectedBancas([]);
        setSelectedMaterias([]);
        setSelectedProvas([]);
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className='global-pageContainer-left'>
            <Modal
                isOpen={modalFiltroIsOpen}
                onRequestClose={closeModalFiltro}
                style={customStyles}
                contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Filtros</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div className='filtros-questoes'>
                        <h4>Bancas:</h4>
                        <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={bancas} value={selectedBancas} isMulti onChange={handleChangeSelectBanca} />
                        
                        <h4>Provas:</h4>
                        <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={provas} value={selectedProvas} isMulti onChange={handleChangeSelectProva} />
                        
                        <h4>Matérias:</h4>
                        <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={materias} value={selectedMaterias} isMulti onChange={handleChangeSelectMateria} />

                        <h4>Assuntos:</h4>
                        <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={assuntos} value={selectedAssuntos} isMulti onChange={handleChangeSelectAssunto} />
                    </div>
                    <div className='botoesModalFiltro'>
                        <button className='global-button global-button--transparent' onClick={limparFiltro}>Limpar</button>
                        <button className='global-button global-button' onClick={buscaQuestoesFiltrando}>Filtrar</button>
                    </div>
                </div>
            </Modal>
            {
                filtro ?
                <>
                    <div className='total'>
                        <button className='global-button global-button--transparent' onClick={voltarListagemProva}>Voltar</button>
                    </div>
                    <h3 className='nomeProvaDescricao'>
                        Prova: {prova?.nomeProva} 
                        <br/>
                        Banca: {prova?.banca}
                        <br/>
                        Tipo: {prova?.tipoProva}
                        <br/>
                        Local: {prova?.local}
                        <br />
                        {
                            localStorage.getItem(Config.ADMIN) == '1' ?
                                <>
                                    Status: <b>{prova?.isActive == '1' ? 'ATIVO' : 'DESATIVADO'}</b>
                                </>
                                :
                                <></>
                        }
                    </h3>
                </>
                :
                <></>
            }
            <div className='opcoesQuestoes'>
                {
                    localStorage.getItem(Config.ADMIN) == '1' && filtro ?
                        <>
                            <button className='global-button global-button--transparent global-button--full-width' onClick={() => AtualizaStatus(prova?.id, prova?.isActive)}>{prova?.isActive == '1' ? 'DESATIVAR' : 'ATIVAR'}</button>
                        </>
                        :
                        <></>
                }
                <div className='opcaoFiltro'>
                    {
                        localStorage.getItem(Config.ADMIN) == '1' && filtro ?
                        <h3 onClick={addQuestao}><BsFileEarmarkPlusFill/>  Adicionar</h3>
                        :
                        <></>
                    }
                </div>
            </div>
            {
                !filtro ? 
                <div className='opcoes-top-tabela'>
                    <h3>Questões (Total: {quantity})</h3>
                    <h2><BsFunnelFill className='link' onClick={openModalFiltro} /></h2>
                </div>
                :
                <div className=''>
                    <h3>Questões (Total: {quantity})</h3>
                </div>
            }
            <div className='global-fullW'>
            <Table>
                <thead>
                    <tr>
                        {
                            !filtro && localStorage.getItem(Config.ADMIN) === '1' ?
                            <th>
                                Código
                            </th>
                            :<></>
                        }
                        <th>
                            <h4>
                            Nº Questão
                            </h4>
                        </th>
                        <th>
                            <h4>
                            Matéria
                            </h4>
                        </th>
                        <th>
                            <h4>
                                Assunto
                            </h4>
                        </th>
                        {
                            !filtro ?
                            <th>
                                Prova
                            </th>
                            :<></>
                        }
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        questoes.map((item) => {
                            return(
                                <tr key={item.id}>
                                    {
                                        !filtro && localStorage.getItem(Config.ADMIN) === '1' ?
                                        <td className='option'>
                                            {
                                                localStorage.getItem(Config.ADMIN) === '1' ?
                                                <h4 onClick={() => editaQuestao(item.id)}>
                                                    ✏️{item.id}
                                                </h4>
                                                :
                                                <h4 onClick={() => abreQuestao(item.id)}>
                                                    ✏️{item.id}
                                                </h4>
                                            }
                                        </td>
                                        :<></>
                                    }
                                    <td className='option'>
                                        <a>
                                            {
                                                localStorage.getItem(Config.ADMIN) === '1' ?
                                                <h4 onClick={() => editaQuestao(item.id)}>
                                                    ✏️{item.numeroQuestao}
                                                </h4>
                                                :
                                                <h4 onClick={() => abreQuestao(item.id)}>
                                                    ✏️{item.numeroQuestao}
                                                </h4>
                                            }
                                        </a>
                                    </td>
                                    <td>
                                        <h4 onClick={() => abreQuestao(item.id)}>
                                        {item.materia}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 onClick={() => abreQuestao(item.id)}>
                                        {item.assunto}
                                        </h4>
                                    </td>
                                    {
                                        !filtro ?
                                        <td>
                                            {item.prova?.nomeProva}
                                        </td>
                                        :<></>
                                    }
                                    <td>
                                        {item?.respostasUsuarios?.find(element => item?.respostasQuestoes.find(elem => elem.codigo == element.codigoResposta && elem.certa === "1")) !== undefined ? 
                                        <button className='global-button-right global-button--full-width' onClick={() => abreQuestao(item.id)}>Respondida</button>
                                        :
                                        <>
                                        {
                                            item?.respostasUsuarios?.find(element => item?.respostasQuestoes.find(elem => elem.codigo == element.codigoResposta && elem.certa === "0")) !== undefined ? 
                                            <button className='global-button-wrong global-button--full-width' onClick={() => abreQuestao(item.id)}>Responder</button>
                                            :
                                            <button className='global-button global-button--full-width' onClick={() => abreQuestao(item.id)}>Responder</button>
                                        }
                                        </>
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            </div>
            <div className='itensPaginacao global-mt'>
                {
                    quantity > 0 ?
                        <Stack spacing={4}>
                            <Pagination sx={{
                    '& .Mui-selected': {
                        color: 'white'},
                    '& .MuiPaginationItem-root': {
                        color: 'white',
                  
                  }}} count={parseInt(Math.ceil(quantity / quantityPerPage))} page={parseInt(page)} color="primary" showFirstButton showLastButton onChange={handleChange} />
                        </Stack>
                        :
                        <>
                        </>
                }
            </div>

        </div>
    )
}

export default ListagemQuestoes;