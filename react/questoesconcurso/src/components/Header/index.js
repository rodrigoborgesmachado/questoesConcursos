import './style.css';
import {Link} from 'react-router-dom';

function Header(){
    return(
        <header>
            <Link className='logo' to='/'><span>Questões de Concurso</span></Link>
        </header>
    )
}

export default Header;