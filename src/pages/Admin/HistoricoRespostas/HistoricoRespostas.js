import { useEffect, useState } from "react";
import api from '../../../services/api.js';
import Config from "../../../config.json";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import Modal from 'react-modal';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { customStyles, formatDate, abreQuestao } from "../../../services/functions.js";

function HistoricoRespostas(){
    const style = customStyles();
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [historicoRespostas, setHistoricoRespostas] = useState([])
    const [index, setIndex] = useState(0)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(20);

    function openModal(index) {
        setIndex(index);
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    async function buscaDados(page) {
        if (!localStorage.getItem(Config.TOKEN)) {
            toast.info('Necessário logar para acessar!');
            navigate('/', { replace: true });
            return;
        }

        await api.get(`/respostasusuaro/pagged?page=${page}&quantity=${quantityPerPage}&idUser=-1`)
            .then((response) => {
                setHistoricoRespostas(response.data.object);
                setQuantity(response.data.total);
                setLoadding(false);
            }).catch(() => {
                toast.error('Erro ao buscar os dados');
                navigate('/', { replace: true });
                return;
            });
    }

    useEffect(() => {
        buscaDados(page);
    }, []);

    const handleChange = (event, value) => {
        setPage(value);
        setLoadding(true);
        buscaDados(value);
    };

    if (loadding) {
        return (
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="containerpage global-fullW">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={style}
                contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Log</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div className="detalhes-modal-separado">
                        <h4>Id: {historicoRespostas[index].id}</h4>
                        <h4>Nome: {historicoRespostas[index].usuario.nome}</h4>
                        <h4>Email: {historicoRespostas[index].usuario.email}</h4>
                        <h4>Data da resposta: {formatDate(historicoRespostas[index].dataResposta)}</h4>
                        <h4>Prova: {historicoRespostas[index].questao.prova.nomeProva}</h4>
                        <button className='global-button global-button--full-width' onClick={() => abreQuestao(historicoRespostas[index].questao.id)}>Visualizar Questão</button>
                    </div>
                </div>
            </Modal>
            <div className='dados global-infoPanel'>
                <h3>Histórico de respostas ({quantity}):</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>
                                Id
                            </th>
                            <th>
                                Nome
                            </th>
                            <th>
                                Questão
                            </th>
                            <th>
                                Prova
                            </th>
                            <th>
                                Data
                            </th>
                            <th>
                                Certa
                            </th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            historicoRespostas.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td className='option'>
                                            <h4 onClick={() => openModal(index)}>
                                                <a>{item.id}</a>
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.usuario.nome}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.questao.id}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.questao.prova.id}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {formatDate(item.dataResposta)}
                                            </h4>
                                        </td>
                                        <td>
                                            {
                                                item.resposta.certa == '1' ? 'Certa':'Errada'
                                            }
                                        </td>
                                        <td className='option'>
                                            <h4 onClick={() => openModal(index)}>
                                                <a><VisibilityIcon/></a>
                                            </h4>
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
                
                }}} count={Math.ceil(quantity / quantityPerPage)} page={parseInt(page)} color="primary" showFirstButton showLastButton onChange={handleChange} />
                    </Stack>
                    :
                    <>
                    </>
            }
            </div>
        </div>
    )
}

export default HistoricoRespostas;