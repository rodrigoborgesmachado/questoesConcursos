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
function Usuarios(){
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [usuarios, setUsuarios] = useState([])
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

        await api.get(`/Usuarios/pagged?page=${page}&quantity=${quantityPerPage}`)
            .then((response) => {
                setUsuarios(response.data.object);
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

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    async function ReenviaEmail(mail){
        setLoadding(true);

        await api.get('/Usuarios/reenviaEmailConfirmacao?mail=' + mail)
        .then((response) => {
            setLoadding(false);

            if(response.data.success){
                toast.success('Email reenviado!');
            }
            else{
                toast.warn('Não foi possível reenviar o email.');
            }
        })
        .catch(() => {
            setLoadding(false);
            toast.warn('Não foi possível reenviar o email.');
        })
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
                        <h3>Log</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div className="detalhes-modal-separado">
                        <h4>Id: {usuarios[index].id}</h4>
                        <h4>Login: {usuarios[index].login}</h4>
                        <h4>Nome: {usuarios[index].nome}</h4>
                        <h4>Email: {usuarios[index].email}</h4>
                        <h4>Data de nascimento: {usuarios[index].dataNascimento}</h4>
                        <h4>
                            Foi verificado: {usuarios[index].isVerified == "1" ? "Sim" : "Não"} 
                            {
                                usuarios[index].isVerified == "1" ? 
                                <></> 
                                : 
                                <button className='global-button' onClick={() => ReenviaEmail(usuarios[index])}>Reenviar email</button>
                            }
                        </h4>
                        <h4>Perfil: {usuarios[index].tipoPerfil?.descricao}</h4>
                        <h4>Instituicao: {usuarios[index].instituicao}</h4>
                        <h4>Criado: {formatDate(usuarios[index].created)}</h4>
                        <h4>Atualizado: {formatDate(usuarios[index].updated)}</h4>
                    </div>
                </div>
            </Modal>
            <div className='dados global-infoPanel'>
                <h3>Usuarios ({quantity}):</h3>
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
                                Email
                            </th>
                            <th>
                                Perfil
                            </th>
                            <th>
                                Criado
                            </th>
                            <th>
                                Verificado
                            </th>
                            <th>

                            </th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            usuarios.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td className='option'>
                                            <h4 onClick={() => openModal(index)}>
                                                <a>{item.id}</a>
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.nome}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.email}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.tipoPerfil?.descricao}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {formatDate(item.created)}
                                            </h4>
                                        </td>
                                        <td>
                                            <h4>
                                                {item.isVerified}
                                            </h4>
                                        </td>
                                        <td>
                                            {
                                                item.isVerified == '0' ?
                                                <button className='global-button' onClick={() => ReenviaEmail(item.email)}>Reenviar email</button>
                                                :<></>
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

export default Usuarios;