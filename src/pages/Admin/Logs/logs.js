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
import { customStyles, formatDate } from "../../../services/functions.js";

function Logs(){
    const style = customStyles();
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [logs, setlogs] = useState([])
    const [index, setIndex] = useState(0)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(20);
    const [modalFiltroIsOpen, setModalFiltroIsOpen] = useState(false);
    const [filtro, setFiltro] = useState('');

    function openModal(index) {
        setIndex(index);
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    function openModalFiltro() {
        setModalFiltroIsOpen(true);
    }

    function closeModalFiltro() {
        setModalFiltroIsOpen(false);
    }

    async function buscaDados(page) {
        if (!localStorage.getItem(Config.TOKEN)) {
            toast.info('Necessário logar para acessar!');
            navigate('/', { replace: true });
            return;
        }
        closeModalFiltro();

        await api.get(`/Logger/pagged?page=${page}&quantity=${quantityPerPage}${(filtro ? '&message=' + filtro : '')}`)
            .then((response) => {
                setlogs(response.data.object);
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
                        <h4>Id: {logs[index].id}</h4>
                        <h4>Descrição: {logs[index].descricao}</h4>
                        <h4>Data de criação: {formatDate(logs[index].created)}</h4>
                        <h4>Data de atualização: {formatDate(logs[index].updated)}</h4>
                        <h4>Tipo: {logs[index].tipo}</h4>
                        <h4>StackTrace: {logs[index].stackTrace}</h4>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={modalFiltroIsOpen}
                onRequestClose={closeModalFiltro}
                style={style}
                contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Filtro</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                        <h4>Descrição:</h4>
                    <div className="detalhes-modal-separado criarUsuario">
                        <input type='text' value={filtro} onChange={(e) => setFiltro(e.target.value)}/>
                    </div>
                    <div className='botoesModalFiltro'>
                        <button className='global-button global-button' onClick={() => buscaDados(1)}>Filtrar</button>
                    </div>
                </div>
            </Modal>
            <div className='dados global-infoPanel'>
                <div className='opcoes-top-tabela'>
                    <h3>Logs ({quantity}):</h3>
                    <h3 className='link'><button className='global-button global-button--transparent' onClick={openModalFiltro}>Filtrar</button></h3>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>
                                Código
                            </th>
                            <th>
                                Descrição
                            </th>
                            <th>
                                Data
                            </th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            logs.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td className='option'>
                                            <h4 onClick={() => openModal(index)}>
                                                <a>{item.id}</a>
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.descricao}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {formatDate(item.created)}
                                            </h4>
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

export default Logs;