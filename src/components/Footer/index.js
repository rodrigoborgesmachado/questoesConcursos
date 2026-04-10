import './style.css';
import { Link } from 'react-router-dom';

function Footer(){
    return(
        <footer className='site-footer'>
            <div className='site-footer-content'>
                <p>
                    Questoes Aqui - Produto educacional da <strong>SunSale System</strong>.
                </p>

                <nav className='footer-links' aria-label='Links institucionais'>
                    <a target='_blank' rel='noreferrer' href='http://www.sunsalesystem.com.br/'>SunSale System</a>
                    <Link to='/sobre'>Sobre</Link>
                    <Link to='/privacidade'>Privacidade</Link>
                    <Link to='/termos'>Termos</Link>
                    <Link to='/contato'>Contato</Link>
                </nav>

                <small>(c) {new Date().getFullYear()} SunSale System. Todos os direitos reservados.</small>
            </div>
        </footer>
    )
}

export default Footer;
