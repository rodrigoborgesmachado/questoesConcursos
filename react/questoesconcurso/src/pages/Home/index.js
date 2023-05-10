import './style.css';
import { Link } from 'react-router-dom';

function Home(){
    return(
        <div className="containerpage">
            <h3>
                <span>
                Com o QuestoesAqui, você pode se preparar para o Enem, Vestibulares e outros concursos públicos resolvendo questões de provas anteriores. Temos uma grande variedade de questões para você praticar, organizadas por disciplina e assunto. Além disso, você pode acompanhar seu progresso, identificar suas áreas de maior dificuldade e aprimorar seus conhecimentos com as explicações detalhadas de cada questão. Prepare-se para os desafios acadêmicos e profissionais com o QuestoesAqui!
                </span>
            </h3>
            <br/>
            <div className='botoes'>
                <Link className='botao' to={`/questoes/aleatoria`}>Iniciar com questões aleatórias</Link>
                <Link className='botao' to={`/questoes/enem`}>Iniciar com questões do ENEM</Link>
                <Link className='botao' to={`/materias`}>Selecionar questões por matéria</Link>
                <Link className='botao' to={`/bancas`}>Selecionar questões por bancas</Link>
            </div>
        </div>
    )
}

export default Home;