import { Link } from 'react-router-dom';
import '../Institucional/style.css';

function Sobre() {
    return (
        <div className='containerpage global-fullW institutional-page'>
            <div className='global-infoPanel institutional-card'>
                <h2 className='institutional-title'>Sobre o Questões Aqui</h2>

                <p className='institutional-paragraph'>
                    O Questões Aqui é uma plataforma de estudo voltada para prática de questões,
                    revisão de conteúdo e acompanhamento de desempenho de candidatos e estudantes.
                </p>

                <h3 className='institutional-section-title'>Nossa proposta</h3>
                <p className='institutional-paragraph'>
                    Tornar o estudo mais objetivo e recorrente, com foco em resolução prática, histórico
                    de respostas e navegação simplificada por provas, bancas e temas.
                </p>

                <h3 className='institutional-section-title'>Para quem é a plataforma</h3>
                <ul className='institutional-list'>
                    <li>Candidatos a concursos públicos.</li>
                    <li>Estudantes em preparação para avaliações.</li>
                    <li>Professores e administradores que organizam conteúdo e simulados.</li>
                </ul>

                <h3 className='institutional-section-title'>Tecnologia e evolução</h3>
                <p className='institutional-paragraph'>
                    A plataforma está em evolução contínua, com melhorias de experiência, autenticação,
                    desempenho e organização de conteúdo para escalar com qualidade e segurança.
                </p>

                <h3 className='institutional-section-title'>Responsável técnico</h3>
                <p className='institutional-paragraph'>
                    Projeto mantido no ecossistema da SunSale System, com foco em soluções digitais
                    e produtos web para produtividade e educação.
                </p>

                <div className='institutional-cta'>
                    <Link className='global-button global-button--transparent' to='/contato'>Entrar em contato</Link>
                </div>
            </div>
        </div>
    );
}

export default Sobre;

