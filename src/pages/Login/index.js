import './style.css';
import api from '../../services/api.js';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader.js';
import { useAuth } from '../../auth/useAuth';
import { useSearchParams } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loadding, setLoadding] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    async function logar() {
        setLoadding(true);
        await login({ email, password: senha })
            .then(() => {
                setLoadding(false);
                toast.success('Bem vindo!');
                navigate('/', { replace: true });
            }).catch((error) => {
                setLoadding(false);
                if(error.response?.status == 300){
                    toast.error('Usuário não verificado! Favor acessar seu email ou entre em contato com o suporte!');
                    ReenviaEmail(email);
                }
                else{
                    toast.error('Usuário ou senhas incorretos');
                }

                return;
            });
    }

    async function ReenviaEmail(mail){
        setLoadding(true);

        await api.get('/Usuarios/reenviaEmailConfirmacao?mail=' + mail)
        .then((response) => {
            setLoadding(false);

            if(response.data.success){
                toast.success('Email de ativação reenviado!');
            }
            else{
                toast.warn(response.data.message);
            }
        })
        .catch(() => {
            setLoadding(false);
            toast.warn('Não foi possível reenviar o email.');
        })
    }

    function criarUsuario() {
        navigate('/criarUsuario', { replace: true });
    }

    useEffect(() => {
        if (searchParams.get('reason') === 'session-expired') {
            toast.info('Sessão expirada. Faça login novamente.');
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    if (isAuthenticated) {
        navigate('/', { replace: true });
    }

    if (loadding) {
        return (
            <PacmanLoader/>
        )
    }

    return (
        <div className="global-pageContainer">
            <div className='global-infoPanel global-miniW'>
                <div className='login'>

                    <div className='login-wrapper'>
                        <div className='login-selected'>
                            Logar
                        </div>
                        <div className='login-unselected' onClick={criarUsuario}>
                            Registrar
                        </div>
                    </div>

                    <div className='separator'></div>
                    <label for="email">Email:</label>
                    <input type="email" name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required={true}></input>
                    <label for="email">Senha:</label>
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required={true}></input>
                    <div className='global-buttonWrapper'>
                        <button className='global-button global-button--transparent global-button--full-width' onClick={logar}>Logar</button>
                        <Link className='global-button global-button--transparent global-button--basic global-button--full-width' to={`/recoverypass`}>Esqueci minha senha</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login;
