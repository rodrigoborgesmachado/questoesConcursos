import './style.css';
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import Config from "../../config.json";
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';

function PerfilUsuario(){
    const[usuario, setUsuario] = useState();
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(false);

    useEffect(() => {
        async function BuscaDadosUsuario(){
            setLoadding(true);
            await api.get('/Usuarios/getPerfil')
            .then((response) => {
                setLoadding(false);
                setUsuario(response.data.object);
            })
            .catch(() => {
                toast.warn('Erro ao buscar dados');
                navigate('/', true);
            });
        }

        if(localStorage.getItem(Config.LOGADO) === '1'){
            BuscaDadosUsuario();
        }
        else{
            navigate('/', true);
        }
    }, []);

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="containerpage">
            <div className='dados'>
                <h2>
                    Dados do usuário
                </h2>
                <div className='separator separator--withMargins'></div>
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
                    <br/>
                    <br/>
                    Taxa de acertos:
                </h4>
                {/* <LinearProgressWithLabel  color="primary" value={parseInt((usuario?.quantidadeQuestoesAcertadas/usuario?.quantidadeQuestoesResolvidas) * 100)} /> */}
                <LinearProgressWithLabel sx={{
                  backgroundColor: 'white',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'green'
                  }
                }} color="primary" value={parseInt((usuario?.quantidadeQuestoesAcertadas/usuario?.quantidadeQuestoesResolvidas) * 100)} />
            </div>
        </div>
    )    
}

export default PerfilUsuario;