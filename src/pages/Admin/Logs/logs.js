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
function Logs(){
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [logs, setlogs] = useState([])
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

        await api.get(`/Logger/pagged?page=${page}&quantity=${quantityPerPage}`)
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
                style={customStyles}
                contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Log</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div>
                        <h4>
                            Id: {logs[index].id}
                            <br/>
                            Descrição: {logs[index].descricao}
                            <br/>
                            Data de criação: {logs[index].created}
                            <br/>
                            Data de atualização: {logs[index].updated}
                            <br/>
                            Tipo: {logs[index].tipo}
                            <br/>
                            StackTrace: {logs[index].stackTrace}
                        </h4>
                    </div>
                </div>
            </Modal>
            <div className='dados global-infoPanel'>
                <h3>Logs:</h3>
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
                                                {item.created}
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
                
                }}} count={parseInt((quantity / quantityPerPage) + 1)} page={parseInt(page)} color="primary" showFirstButton showLastButton onChange={handleChange} />
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