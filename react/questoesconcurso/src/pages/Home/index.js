import './style.css';
import { Link } from 'react-router-dom';

function Home(){
    return(
        <div className="containerpage">
            <h3>
                <span>
                Seja bem-vindo ao maravilhoso mundo do QuestoesAqui, onde desvendamos os segredos das provas mais desafiadoras! 🚀🔍<br/><br/>
                📚 Aqui, você vai embarcar em uma aventura incrível de preparação para o Enem, Vestibulares e concursos públicos, desvendando mistérios e desafios em forma de questões de provas anteriores. 📝🔮<br/><br/>
                🔥 Prepare-se para mergulhar em uma infinidade de perguntas surpreendentes, organizadas por disciplina e assunto. Temos um verdadeiro tesouro de questões para você praticar e se tornar um mestre da sabedoria acadêmica! 🗝️💡<br/><br/>
                💪 Ao longo dessa jornada, você vai poder acompanhar seu progresso e desvendar seus pontos fortes e fracos. Com as explicações detalhadas de cada questão, você vai aprimorar seus conhecimentos como um verdadeiro detetive do conhecimento! 🕵️‍♀️🔎<br/><br/>
                🚀 Então, prepare-se para os desafios acadêmicos e profissionais com o QuestoesAqui! A aventura começa agora, e estamos prontos para ajudá-lo a alcançar as estrelas do conhecimento! 🌟✨<br/><br/>
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