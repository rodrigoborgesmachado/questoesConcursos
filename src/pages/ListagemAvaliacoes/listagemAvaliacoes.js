import './listagemAvaliacoes.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../services/api.js';
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Modal from 'react-modal';
import { BsFunnelFill, BsFileEarmarkPlusFill } from "react-icons/bs";
import Config from './../../config.json';

const customStyles = {
    content: {
        top: '30%',
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
function ListagemAvaliacoes(){
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(false);
    const[avaliacoes, setAvaliacoes] = useState([]);
    const[chave, setChave] = useState('');
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [quantityPerPage] = useState(7);
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    async function BuscaAvaliacoes(page){
        if (!localStorage.getItem(Config.TOKEN)) {
            toast.info('Necessário logar para acessar!');
            navigate('/', { replace: true });
            return;
        }

        setLoadding(true);
        await api.get(`/Avaliacao/pagged?page=${page}&quantity=${quantityPerPage}&chave=${chave}`)
        .then((response) => {
            if(response.data.success){
                setAvaliacoes(response.data.object);
                setQuantity(response.data.total)
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar avaliações');    
            }
            setLoadding(false);
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar avaliações');
        })
    }

    useEffect(() => {
        BuscaAvaliacoes(page);
    }, []);

    const handleChange = (event, value) => {
        setPage(value);
        BuscaAvaliacoes(value);
    };

    function filtrar(){

    }

    function openAvaliacao(id){
        navigate('/avaliacoes/' + id, { replace: true });
    }

    function addAvaliacao(){
        navigate('/cadastroavaliacao?previus=avaliacoes', { replace: true });
    }

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
                        <h3>Filtros</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div className='filtrosProva'>
                        <h4>Filtrar chave</h4>
                        <input type='text' value={chave} onChange={(e) => setChave(e.target.value)}></input>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div className='botoesModalFiltroAvaliacoes'>
                        <button className='global-button global-button' onClick={filtrar}>Buscar</button>
                    </div>
                </div>
            </Modal>
            <div className='global-infoPanel'>
                <div>
                    {
                        localStorage.getItem(Config.ADMIN) === '2' ?
                        <h3 className='link' onClick={addAvaliacao} ><BsFileEarmarkPlusFill/>Adicionar avaliação</h3>
                        :
                        <></>
                    }
                </div>
                <div className='opcoesFiltro'>
                    <h3>Avaliações</h3>
                    <h3 className='link'><BsFunnelFill onClick={openModal} /></h3>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>
                                Nome
                            </th>
                            <th>
                                Professor
                            </th>
                            <th>
                                Nº Questões
                            </th>
                            <th>
                                Valor Total
                            </th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            avaliacoes.map((item, index) => {
                                return(
                                    <tr key={item}>
                                        <td>
                                            <h4>
                                                {item.nome}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.usuario.nome}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.questoesAvaliacao.length}
                                            </h4>
                                        </td>
                                        <td>
                                            {
                                                item.questoesAvaliacao.reduce((acc, questao) => acc + questao.notaQuestao, 0)
                                            }
                                        </td>
                                        <td className='option'>
                                            <h4 onClick={() => openAvaliacao(item.id)}>
                                                <VisibilityIcon className='vis' onClick={() => openAvaliacao(item.id)}/>
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
            
            }}} count={parseInt(Math.ceil(quantity / quantityPerPage))} page={parseInt(quantity)} color="primary" showFirstButton showLastButton onChange={handleChange} />
                    </Stack>
                    :
                    <>
                    </>
            }
            </div>
        </div>
    )
}

export default ListagemAvaliacoes;