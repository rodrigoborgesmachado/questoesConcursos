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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function HistoricoTabuadaDivertida(){
    const styles = customStyles();
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [HistoricoTabuadaDivertida, setHistoricoTabuadaDivertida] = useState([])
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

        await api.get(`/ResultadosTabuadaDivertida/pagged?page=${page}&quantity=${quantityPerPage}`)
            .then((response) => {
                setHistoricoTabuadaDivertida(response.data.object);
                setQuantity(response.data.total);
                setLoadding(false);
            }).catch(() => {
                toast.error('Erro ao buscar os dados');
                navigate('/', { replace: true });
                return;
            });
    }

    async function deleteItem(id){
        await api.delete(`/ResultadosTabuadaDivertida?id=${id}`)
            .then((response) => {
                if(response.data.object){
                    toast.info('Deletado com sucesso!');
                    setLoadding(true);
                    buscaDados(page);
                }
                else{
                    toast.error('Erro ao deletar');
                    buscaDados(page);
                }
            }).catch(() => {
                toast.error('Erro ao deletar');
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
                style={styles}
                contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Log</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div>
                        <h4>
                            Id: {HistoricoTabuadaDivertida[index].Id}
                            <br/>
                            Nome: {HistoricoTabuadaDivertida[index].nome}
                            <br/>
                            Tempo: {HistoricoTabuadaDivertida[index].tempo}
                            <br/>
                            Número de acertos: {HistoricoTabuadaDivertida[index].numeroAcertos}
                            <br/>
                            Número de questões: {HistoricoTabuadaDivertida[index].numeroQuestoes}
                            <br/>
                            Created: {formatDate(HistoricoTabuadaDivertida[index].created)}
                            <br/>
                            Tipo: {HistoricoTabuadaDivertida[index].tipo}
                        </h4>
                    </div>
                </div>
            </Modal>
            <div className='dados global-infoPanel'>
                <h3>Historico Tabuada Divertida ({quantity}):</h3>
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
                                Acertos
                            </th>
                            <th>
                                Questões
                            </th>
                            <th>
                                Tempo
                            </th>
                            <th>
                                Data
                            </th>
                            <th>
                                Tipo
                            </th>
                            <th>

                            </th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            HistoricoTabuadaDivertida.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td className='option'>
                                            <h4 onClick={() => openModal(index)}>
                                                <a>{item.Id}</a>
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.nome}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.numeroAcertos}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.numeroQuestoes}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.tempo}s
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {formatDate(item.created)}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.tipo}
                                            </h4>
                                        </td>
                                        <td className='option'>
                                            <h4 onClick={() => openModal(index)}>
                                                <a><VisibilityIcon/></a>
                                            </h4>
                                        </td>
                                        <td className='option'>
                                            <h4 onClick={() => deleteItem(item.Id)}>
                                                <a><HighlightOffIcon/></a>
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

export default HistoricoTabuadaDivertida;