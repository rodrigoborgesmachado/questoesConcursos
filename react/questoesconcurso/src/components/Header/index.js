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
        sessionStorage.setItem(Config.TOKEN, '');
        sessionStorage.removeItem(Config.LOGADO);
        sessionStorage.removeItem(Config.USUARIO);
        sessionStorage.removeItem(Config.TOKEN);
        
        toast.success('Volte sempre!');
        navigate('/', {replace: true});
    }

    return (
        <ResponsiveAppBar/>
    )
}

export default Header;