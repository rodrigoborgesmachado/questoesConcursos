import './style.css';
import { useNavigate } from 'react-router-dom';

function Header(){
    const navigate = useNavigate();

    return(
        <footer>
            <h1><a target='_blank' rel='noreferrer' href='http://www.sunsalesystem.com.br/' >SunSale System</a> | <a onClick={() => navigate('/contato', {replace: true})}>Contato</a></h1>
        </footer>
    )
}

export default Header;