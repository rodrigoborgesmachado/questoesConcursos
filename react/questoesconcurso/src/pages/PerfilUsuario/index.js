import './style.css';
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import Config from "../../config.json";
import api from '../../services/api.js';
import {toast} from 'react-toastify';

function PerfilUsuario(){
    const[usuario, setUsuario] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        async function BuscaDadosUsuario(){
            await api.get('/Usuarios/getPerfil')
            .then((response) => {
                setUsuario(response.data.object);
            })
            .catch(() => {
                toast.warn('Erro ao buscar dados');
                navigate('/', true);
            });
        }

        if(sessionStorage.getItem(Config.LOGADO) === '1'){
            BuscaDadosUsuario();
        }
        else{
            navigate('/', true);
        }
    }, []);

    return(
        <div className="containerpage">
            <div className='dados'>
                <h2>
                    Dados do usuário
                </h2>
                <br/>
                <h4>
                    Nome: {usuario?.usuario?.nome}
                    <br/>
                    <br/>
                    Email: {usuario?.usuario?.email}
                    <br/>
                    <br/>
                    Perfil: {usuario?.usuario?.admin === "1" ? 'Administrador' : 'Aluno'}
                    <br/>
                    <br/>
                    Quantidade de questões resolvidas: {usuario?.quantidadeQuestoesResolvidas}
                    <br/>
                    <br/>
                    Quantidade de questões acertadas: {usuario?.quantidadeQuestoesAcertadas}
                </h4>
            </div>
        </div>
    )    
}

export default PerfilUsuario;