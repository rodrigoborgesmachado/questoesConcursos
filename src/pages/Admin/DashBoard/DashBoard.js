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


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        border: 0,
        background: '#424242',
        marginRight: '-50%',
        'border-radius': '5px',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        overflow: "auto",
        position: "fixed"
    },
};

function DashBoard(){
    const navigate = useNavigate();
    const [dados, setDados] = useState({});
    const [loadding, setLoadding] = useState(true);
    const[questoes, setQuestoes] = useState([])
    const [modalQuestoesIsOpen, setModalQuestoesIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(8);
    function openModalQuestoes() {
        setModalQuestoesIsOpen(true);
    }

    function closeModalQuestoes() {
        setModalQuestoesIsOpen(false);
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
                setQuantity(response.data.object.quantidadeQuestoesSolicitadasRevisao);
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

    useEffect(() => {

        buscaDados();
    }, []);

    function formataData(data){
        return data.split('-')[2] + '/' + data.split('-')[1] + '/' + data.split('-')[0];
    }

    function abreQuestao(codigoQuestao){
        navigate('/questoes/codigoquestaolistagem:' + codigoQuestao, {replace: true});
    }

    const handleChange = (event, value) => {
        setPage(value);
        setLoadding(true);
        buscaQuestoesParaRevisao(value);
    };

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
                style={customStyles}
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
                                                <td className='option'>
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
                    quantity > 0 ?
                        <Stack spacing={4}>
                            <Pagination sx={{
                    '& .Mui-selected': {
                        color: 'white'},
                    '& .MuiPaginationItem-root': {
                        color: 'white',
                  
                  }}} count={parseInt((quantity / quantityPerPage) + 1)} page={parseInt(page)} color="primary" showFirstButton showLastButton onChange={handleChange} />
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
                    <h3>Usuários:</h3>
                    <div className='dadosDashboard'>
                        <h4>Quantidade de usuários verificados: {dados?.quantidadeVerificados}</h4>
                        <h4>Quantidade de usuários não verificados: {dados?.quantidadeNaoVerificados}</h4>
                    </div>
                    <div className='dadosDashboard'>
                        <h4>Quantidade de usuários total: {dados?.quantidadeTotal}</h4>
                    </div>
                    <br/>
                    <h3>Respostas</h3>
                    <div className='dadosDashboard'>
                        <h4>Quantidade de respostas certas: {dados?.quantidadeRespostasCertas}</h4>
                        <h4>Quantidade de respostas: {dados?.quantidadeRespostas}</h4>
                    </div>
                    <div className='dadosDashboard'>
                        <h4>Quantidade de respostas últimas 24 horas: {dados?.quantidadeRespostasUltimas24Horas}</h4>
                    </div>
                    <br/>
                    <h3>Questões</h3>
                    <div className='dadosDashboard'>
                        <h4>Quantidade de questões ativas: {dados?.quantidadeQuestoesAtivas}</h4>
                        <h4>Quantidade de questões para revisão: {dados?.quantidadeQuestoesSolicitadasRevisao}<VisibilityIcon onClick={(e) => buscaQuestoesParaRevisao(1)}/></h4>
                    </div>
                    <br/>
                    <h3>Provas</h3>
                    <div className='dadosDashboard'>
                        <h4>Quantidade de provas ativas: {dados?.quantidadeProvasAtivas}</h4>
                        <h4>Quantidade de provas em aberto: {dados?.quantidadeProvasDesativasAtivas}</h4>
                    </div>
                </div>
                <br/>
                <h2>Usuários cadastrados nos últimos 30 dias</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    {
                        dados?.usuariosDates?.map((item, index) => {
                            return(
                                <div className="itemUsuarios" key={index}>
                                    <h4>
                                        Dia: {formataData(item.date)} 
                                        <br/>
                                        Quantidade: {item.count}
                                    </h4>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default DashBoard;