import {Link} from 'react-router-dom';
import './style.css';

function Erro(){
    return(
        <div className='containerpage'>
            <div className="not-found">
                <h1>404</h1>
                <h2>Página não encontrada</h2>
                <Link to="/">Home</Link>
            </div>
        </div>
    )
}

export default Erro;