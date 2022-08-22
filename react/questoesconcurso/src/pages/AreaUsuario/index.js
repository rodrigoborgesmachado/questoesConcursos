import './style.css';
import { Link } from 'react-router-dom';
import Config from '../../config.json';

function AreaUsuario(){
    return(
        <div className="containerpage">
            <h3>
                <span>
                    Bem vindo {sessionStorage.getItem(Config.USUARIO)}!
                </span>
            </h3>
            <br/>
            <div className='botoes'>
                <Link className='botao' to={`/historico`}>Histórico de questões</Link>
            </div>
        </div>
    )
}

export default AreaUsuario;