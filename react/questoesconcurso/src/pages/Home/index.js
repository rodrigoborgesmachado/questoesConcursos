import './style.css';
import { Link } from 'react-router-dom';
import Config from '../../config.json';

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
                {
                    sessionStorage.getItem(Config.LOGADO) == null || sessionStorage.getItem(Config.LOGADO) === '0'
                    ?
                    <div></div>
                    :
                    <Link className='botao' to={`/areausuario`}>Área do usuário</Link>
                }
                <Link className='botao' to={`/questoes/aleatoria`}>Iniciar com Questões Aleatórias</Link>
                <Link className='botao' to={`/questoes/enem`}>Iniciar com Questões do Enem</Link>
                <Link className='botao' to={`/materias`}>Selecionar questões por matéria</Link>
                <Link className='botao' to={`/bancas`}>Selecionar questões por bancas</Link>
                <Link className='botao' to={`/provas`}>Selecionar questões por prova</Link>
                <Link className='botaoRanking' to={`/ranking`}>Ranking dos usuários</Link>
            </div>
        </div>
    )
}

export default Home;