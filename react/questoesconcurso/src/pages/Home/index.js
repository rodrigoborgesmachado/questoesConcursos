import './style.css';
import { Link } from 'react-router-dom';

function Home(){
    return(
        <div className="containerpage">
            <h3>
                <span>
                    Teste seus conhecimentos com questões de concursos, vestibulares e questões do Enem.
                </span>
            </h3>
            <br/>
            <div className='botoes'>
                <Link className='botao' to={`/questoes/aleatoria`}>Iniciar com questões aleatórias</Link>
                <Link className='botao' to={`/questoes/enem`}>Iniciar com questões do ENEM</Link>
                <Link className='botao' to={`/materias`}>Selecionar questões por matéria</Link>
                <Link className='botao' to={`/bancas`}>Selecionar questões por bancas</Link>
                <Link className='botao' to={`/provas`}>Selecionar questões por prova</Link>
            </div>
        </div>
    )
}

export default Home;