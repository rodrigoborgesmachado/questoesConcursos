import './style.css';
import { Link } from 'react-router-dom';

function Header(){
    return(
        <footer>
            <div className='footer-links'>
                <a target='_blank' rel='noreferrer' href='http://www.sunsalesystem.com.br/'>SunSale System</a>
                <Link to='/sobre'>Sobre</Link>
                <Link to='/privacidade'>Privacidade</Link>
                <Link to='/termos'>Termos</Link>
                <Link to='/contato'>Contato</Link>
            </div>
        </footer>
    )
}

export default Header;
