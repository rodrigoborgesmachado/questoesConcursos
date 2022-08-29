import './style.css';
import {Link} from 'react-router-dom';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ResponsiveAppBar from '../Navbar';

function Header(){
    const navigate = useNavigate();

    function sair(){
        sessionStorage.setItem(Config.LOGADO, 0);
        sessionStorage.setItem(Config.USUARIO, '');
        sessionStorage.setItem(Config.CodigoUsuario, '');
        toast.success('Volte sempre!');
        navigate('/', {replace: true});
    }

    return (
        <ResponsiveAppBar/>
    )

    return(
        <header>
            <Link className='logo' to='/'><span>Questões de Concurso</span></Link>
            {
                sessionStorage.getItem(Config.LOGADO) == null || sessionStorage.getItem(Config.LOGADO) === '0'
                ?
                <Link className='logo' to='/login'><span>Login</span></Link>
                :
                <Link className='logo' to='/' onClick={sair}><span>Sair</span></Link>
            }
        </header>
    )
}

export default Header;