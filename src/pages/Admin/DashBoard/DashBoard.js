import './DashBoard.css';
import { useEffect, useState } from "react";
import api from '../../../services/api.js';
import Config from "../../../config.json";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import Modal from 'react-modal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { customStyles } from '../../../services/functions.js';
import { abreQuestao } from './../../../services/functions.js';
import BasicPie from './../../../components/GraficoPie/graficoPie.js';
import { BasicBars, StackedBarChart } from '../../../components/GraficoBarra/graficoBarra.js';

function DashBoard(){
    const styles = customStyles();
    const navigate = useNavigate();
    const [dados, setDados] = useState({});
    const [questoesPorUsuarios, setQuestoesPorUsuarios] = useState({});
    const [questoesValidadasPorUsuarios, setQuestoesValidadasPorUsuarios] = useState({});
    const [respostasPorProva, setRespostasPorProva] = useState({});
    const [respostasPorMateria, setRespostasPorMateria] = useState({});
    const [loadding, setLoadding] = useState(true);
    const [questoes, setQuestoes] = useState([])
    const [provas, setProvas] = useState([])
    const [modalQuestoesIsOpen, setModalQuestoesIsOpen] = useState(false);
    const [modalProvasIsOpen, setModalProvasIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [quantityQuestoes, setQuantityQuestoes] = useState(1);
    const [quantityProvas, setQuantityProvas] = useState(1);
    const [quantityPerPage] = useState(8);
    
    function openModalQuestoes() {
        setPage(1);
        setModalQuestoesIsOpen(true);
    }

    function closeModalQuestoes() {
        setModalQuestoesIsOpen(false);
    }

    function openModalProvas() {
        setPage(1);
        setModalProvasIsOpen(true);
    }

    function closeModalProvas() {
        setModalProvasIsOpen(false);
    }

    async function buscaDados() {
        if (!localStorage.getItem(Config.TOKEN)) {
            toast.info('Necessário logar para acessar!');
            navigate('/', { replace: true });
            return;
        }

        await api.get('/Admin/analysis')
            .then((response) => {
                setDados(response.data.object);
                setQuantityQuestoes(response.data.object.quantidadeQuestoesSolicitadasRevisao);
                setQuantityProvas(response.data.object.quantidadeProvasDesativasAtivas);
                setLoadding(false);
                buscaQuantidadeQuestoesCadastradasPorUsuario();
            }).catch(() => {
                toast.error('Erro ao buscar os dados');
                navigate('/', { replace: true });
                return;
            });
    }

    async function buscaQuantidadeQuestoesCadastradasPorUsuario(){
        setLoadding(true);
        await api.get('/Admin/getquantidadequestoescadastradasporusuarios')
            .then((response) => {
                setQuestoesPorUsuarios(response.data.object);
                setLoadding(false);
                buscaQuantidadeQuestoesValidadasPorUsuario();
            }).catch(() => {
                toast.error('Erro ao buscar os dados');
                navigate('/', { replace: true });
                return;
            });
    }

    async function buscaQuantidadeQuestoesValidadasPorUsuario(){
        setLoadding(true);
        await api.get('/Admin/getquantidadequestoesvalidadasporusuarios')
            .then((response) => {
                setQuestoesValidadasPorUsuarios(response.data.object);
                setLoadding(false);
                buscaQuantidadeRespostasPorProva();
            }).catch(() => {
                toast.error('Erro ao buscar os dados');
                navigate('/', { replace: true });
                return;
            });
    }

    async function buscaQuantidadeRespostasPorProva(){
        setLoadding(true);
        await api.get('/Admin/getquantidaderespostasporprova')
            .then((response) => {
                setRespostasPorProva(response.data.object);
                setLoadding(false);
                buscaQuantidadeRespostasPorMateria();
            }).catch(() => {
                toast.error('Erro ao buscar os dados');
                navigate('/', { replace: true });
                return;
            });
    }

    async function buscaQuantidadeRespostasPorMateria(){
        setLoadding(true);
        await api.get('/Admin/getquantidaderespostaspormateria')
            .then((response) => {
                setRespostasPorMateria(response.data.object);
                setLoadding(false);
            }).catch(() => {
                toast.error('Erro ao buscar os dados');
                navigate('/', { replace: true });
                return;
            });
    }

    async function buscaQuestoesParaRevisao(page) {
        await api.get('/Admin/questoespararevisao?page=' + page + '&quantity=' + quantityPerPage)
            .then((response) => {
                setQuestoes(response.data.object);
                setLoadding(false);
                openModalQuestoes();
            }).catch(() => {
                toast.error('Erro ao buscar os dados');
                navigate('/', { replace: true });
                return;
            });
    }

    async function buscaProvasParaRevisao(){
        await api.get('/Admin/provaspararevisao?page=' + page + '&quantity=' + quantityPerPage)
        .then((response) => {
            setProvas(response.data.object);
            setLoadding(false);
            openModalProvas();
        }).catch(() => {
            toast.error('Erro ao buscar os dados');
            navigate('/', { replace: true });
            return;
        });
    }

    useEffect(() => {

        buscaDados();
    }, []);

    function formataData(data){
        return data.split('-')[2] + '/' + data.split('-')[1] + '/' + data.split('-')[0];
    }

    function abreProva(codigoProva){
        navigate('/listagemquestoes/' + codigoProva, {replace: true});
    }


    const handleChange = (event, value) => {
        setPage(value);
        setLoadding(true);
        buscaQuestoesParaRevisao(value);
    };

    const handleChangeProva = (event, value) => {
        setPage(value);
        setLoadding(true);
        buscaProvasParaRevisao(value);
    };

    function criaInformacoesUsuarios(){
        return [
            {
                id:0,
                value: dados?.quantidadeVerificados, 
                color: 'blue',
                label: 'Usuários verificados: ' + dados?.quantidadeVerificados
            },
            {
                id:1,
                value: dados?.quantidadeNaoVerificados, 
                color: 'red',
                label: 'Usuários não verificados' + dados?.quantidadeNaoVerificados
            }
        ]
    }

    function criaInformacoesRespostas(){
        return [
            {
                id:0,
                value: dados?.quantidadeRespostasUltimas24Horas, 
                color: 'red',
                label: 'Últimas 24 horas: ' + dados?.quantidadeRespostasUltimas24Horas
            },
            {
                id:1,
                value: dados?.quantidadeRespostas - dados?.quantidadeRespostasUltimas24Horas, 
                color: 'blue',
                label: 'Restante: ' + (dados?.quantidadeRespostas - dados?.quantidadeRespostasUltimas24Horas)
            }
        ]
    }

    function criaInformacoesTabuadaDivertida(){
        return [
            {
                id:0,
                value: dados?.quantidadeRespostasTabuadaDivertidaUltimas24Horas, 
                color: 'red',
                label: 'Últimas 24 horas: ' + dados?.quantidadeRespostasTabuadaDivertidaUltimas24Horas
            },
            {
                id:1,
                value: dados?.quantidadeRespostasTabuadaDivertida - dados?.quantidadeRespostasTabuadaDivertidaUltimas24Horas, 
                color: 'blue',
                label: 'Restante: ' + (dados?.quantidadeRespostasTabuadaDivertida - dados?.quantidadeRespostasTabuadaDivertidaUltimas24Horas)
            }
        ]
    }

    function criaInformacoesNomesQuestõesCadastradasPorUsuarios(){
        var itens = new Array();

        questoesPorUsuarios.forEach(element => {
            itens.push(element.descricao);
        });

        return itens;
    }

    function criaInformacoesValoresQuestõesCadastradasPorUsuarios(){
        var itens = new Array();

        questoesPorUsuarios.forEach(element => {
            itens.push(element.valor);
        });

        return itens;
    }

    function criaInformacoesNomesQuestõesValidadas(){
        var itens = new Array();

        questoesValidadasPorUsuarios.forEach(element => {
            itens.push(element.descricao);
        });

        return itens;
    }

    function criaInformacoesValoresQuestõesValidadas(){
        var itens = new Array();

        questoesValidadasPorUsuarios.forEach(element => {
            itens.push(element.valor);
        });

        return itens;
    }

    function criaInformacoesNomesUsuariosCadastrados(){
        var itens = new Array();

        dados?.usuariosDates?.forEach(element => {
            itens.push(formataData(element.date));
        });

        return itens;
    }

    function criaInformacoesValoresUsuariosCadastrados(){
        var itens = new Array();

        dados?.usuariosDates?.forEach(element => {
            itens.push(element.count);
        });

        return itens;
    }

    function criaInformacoesNomesRespostasPorProva(){
        var itens = new Array();

        respostasPorProva.forEach(element => {
            itens.push(element.descricao + ' | Total: ' + (element.certas + element.erradas));
        });

        return itens;
    }

    function criaInformacoesValoresRespostasCertasPorProva(){
        var itens = new Array();

        respostasPorProva.forEach(element => {
            itens.push(element.certas);
        });

        return itens;
    }

    function criaInformacoesValoresRespostasErradasPorProva(){
        var itens = new Array();

        respostasPorProva.forEach(element => {
            itens.push(element.erradas);
        });

        return itens;
    }

    function criaInformacoesNomesRespostasPorMateria(){
        var itens = new Array();

        respostasPorMateria.forEach(element => {
            itens.push(element.descricao + ' | Total: ' + (element.certas + element.erradas));
        });

        return itens;
    }

    function criaInformacoesValoresRespostasCertasPorMateria(){
        var itens = new Array();

        respostasPorMateria.forEach(element => {
            itens.push(element.certas);
        });

        return itens;
    }

    function criaInformacoesValoresRespostasErradasPorMateria(){
        var itens = new Array();

        respostasPorMateria.forEach(element => {
            itens.push(element.erradas);
        });

        return itens;
    }

    if (loadding) {
        return (
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return (
        <div className="containerpage global-fullW">
            <Modal
                isOpen={modalQuestoesIsOpen}
                onRequestClose={closeModalQuestoes}
                style={styles}
                contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Questões solicitado revisão</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        Código
                                    </th>
                                    <th>
                                        Matéria
                                    </th>
                                    <th>
                                        Prova
                                    </th>
                                    <th>
                                        Numero Questao
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    questoes.map((item, index) => {
                                        return(
                                            <tr key={item}>
                                                <td className='option link'>
                                                    <h4 onClick={() => abreQuestao(item.id)}>
                                                        <a>✏️{item.id}</a>
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {item.materia}
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {item.prova?.nomeProva}
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {item.numeroQuestao}
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
                <div className='itensPaginacao global-mt'>
                {
                    quantityQuestoes > 0 ?
                        <Stack spacing={4}>
                            <Pagination sx={{
                    '& .Mui-selected': {
                        color: 'white'},
                    '& .MuiPaginationItem-root': {
                        color: 'white',
                  
                  }}} count={parseInt(Math.ceil(quantityQuestoes / quantityPerPage))} page={parseInt(page)} color="primary" showFirstButton showLastButton onChange={handleChange} />
                        </Stack>
                        :
                        <>
                        </>
                }
                </div>
            </Modal>
            <Modal
                isOpen={modalProvasIsOpen}
                onRequestClose={closeModalProvas}
                style={styles}
                contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Provas em revisão</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        Código
                                    </th>
                                    <th>
                                        Nome
                                    </th>
                                    <th>
                                        Banca
                                    </th>
                                    <th>
                                        Created
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    provas.map((item, index) => {
                                        return(
                                            <tr key={item}>
                                                <td className='option'>
                                                    <h4 onClick={() => abreProva(item.id)}>
                                                        <a>✏️{item.id}</a>
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {item.nomeProva}
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {item.banca}
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {item.dataRegistro}
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
                <div className='itensPaginacao global-mt'>
                {
                    quantityQuestoes > 0 ?
                        <Stack spacing={4}>
                            <Pagination sx={{
                    '& .Mui-selected': {
                        color: 'white'},
                    '& .MuiPaginationItem-root': {
                        color: 'white',
                  
                  }}} count={parseInt(Math.ceil(quantityQuestoes / quantityPerPage))} page={parseInt(page)} color="primary" showFirstButton showLastButton onChange={handleChangeProva} />
                        </Stack>
                        :
                        <>
                        </>
                }
                </div>
            </Modal>
            <div className='dados global-infoPanel'>
                <h2>DashBoard</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <div className='dadosDashboard'>
                        <div>
                            <h3>Usuários ({dados?.quantidadeTotal}):</h3>
                            <div className='dadosDashboard'>
                                <BasicPie dados={criaInformacoesUsuarios()}/>
                            </div>
                        </div>
                        <div>
                            <h3>Respostas ({dados?.quantidadeRespostas}):</h3>
                            <div className='dadosDashboard'>
                                <BasicPie dados={criaInformacoesRespostas()}/>
                            </div>
                        </div>
                    </div>
                    <h3>Respostas Tabuada Divertida ({dados?.quantidadeRespostasTabuadaDivertida}):</h3>
                    <div className='dadosDashboard'>
                        <BasicPie dados={criaInformacoesTabuadaDivertida()}/>
                    </div>
                </div>
                <br/>
                <h2>Manutenção de provas e questões</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <h3>Questões</h3>
                    <div className='dadosDashboard'>
                        <h4>Quantidade de questões ativas: {dados?.quantidadeQuestoesAtivas}</h4>
                        <h4>Quantidade de questões para revisão: {dados?.quantidadeQuestoesSolicitadasRevisao}<VisibilityIcon onClick={(e) => buscaQuestoesParaRevisao(1)}/></h4>
                    </div>
                    <h3>Provas</h3>
                    <div className='dadosDashboard'>
                        <h4>Quantidade de provas ativas: {dados?.quantidadeProvasAtivas}</h4>
                        <h4>Quantidade de provas em aberto: {dados?.quantidadeProvasDesativasAtivas}<VisibilityIcon onClick={(e) => buscaProvasParaRevisao(1)}/></h4>
                    </div>
                </div>
                <br/>
                <h2>Quantidade de respostas por prova</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <StackedBarChart nomes={criaInformacoesNomesRespostasPorProva()} pData={criaInformacoesValoresRespostasCertasPorProva()} uData={criaInformacoesValoresRespostasErradasPorProva()} pLabel={'Corretas'} uvLabel = {'Erradas'}/>
                </div>
                <br/>
                <h2>Quantidade de respostas por matéria</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <StackedBarChart nomes={criaInformacoesNomesRespostasPorMateria()} pData={criaInformacoesValoresRespostasCertasPorMateria()} uData={criaInformacoesValoresRespostasErradasPorMateria()} pLabel={'Corretas'} uvLabel = {'Erradas'}/>
                </div>
                <br/>
                <h2>Quantidade de questões cadastradas por usuários</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <BasicBars nomes={criaInformacoesNomesQuestõesCadastradasPorUsuarios()} dados={criaInformacoesValoresQuestõesCadastradasPorUsuarios()}/>
                </div>
                <br/>
                <h2>Quantidade de questões validadas por usuários</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <BasicBars nomes={criaInformacoesNomesQuestõesValidadas()} dados={criaInformacoesValoresQuestõesValidadas()}/>
                </div>
                <br/>
                <h2>Usuários cadastrados nos últimos 30 dias</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <BasicBars nomes={criaInformacoesNomesUsuariosCadastrados()} dados={criaInformacoesValoresUsuariosCadastrados()}/>
                </div>
            </div>
        </div>
    )
}

export default DashBoard;