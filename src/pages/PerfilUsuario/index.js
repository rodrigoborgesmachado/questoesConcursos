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
            <div className='dados glogal-infoPanel'>
                <h2>
                    Dados do usuário
                </h2>
                <div className='separator separator--withMargins'></div>
                <div className='dadosResumidos'>
                    <p className='global-mt'>
                    Nome: {usuario?.usuario?.nome}
                    </p>
                    <p className='global-mt'>
                    Email: {usuario?.usuario?.email}
                    </p>
                    <p className='global-mt'>
                    Perfil: {usuario?.usuario?.admin === "1" ? 'Administrador' : 'Aluno'}
                    </p>
                    <p className='global-mt'>
                    Quantidade de questões resolvidas: {usuario?.quantidadeQuestoesResolvidas}
                    </p>
                    <p className='global-mt'>
                    Quantidade de questões acertadas: {usuario?.quantidadeQuestoesAcertadas}
                    </p>
                    <p className='global-mt'>
                    Taxa de acertos:
                    </p>
                    
                    
                    
                    
                    
                </div>
                {/* <LinearProgressWithLabel  color="primary" value={parseInt((usuario?.quantidadeQuestoesAcertadas/usuario?.quantidadeQuestoesResolvidas) * 100)} /> */}
                <LinearProgressWithLabel className='global-mt' sx={{
                  backgroundColor: '#4B0082',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#8A2BE2'
                  }
                }} color="primary" value={parseInt((usuario?.quantidadeQuestoesAcertadas/usuario?.quantidadeQuestoesResolvidas) * 100)} />
            </div>
        </div>
    )    
}

export default PerfilUsuario;