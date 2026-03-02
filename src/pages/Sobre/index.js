import { Link } from 'react-router-dom';
import '../Institucional/style.css';

function Sobre() {
    return (
        <div className='containerpage global-fullW institutional-page'>
            <div className='global-infoPanel institutional-card'>
                <h2 className='institutional-title'>Sobre o Questões Aqui</h2>

                <p className='institutional-paragraph'>
                    O Questões Aqui é uma plataforma digital de estudos desenvolvida para transformar a forma como
                    candidatos e estudantes praticam e revisam conteúdos. Nosso foco está na resolução estratégica
                    de questões, permitindo que o aprendizado aconteça de forma ativa, prática e orientada por desempenho.
                </p>
                <p className='institutional-paragraph'>
                    Acreditamos que resolver questões não é apenas uma etapa do estudo, é o próprio estudo. Por isso,
                    estruturamos a plataforma para oferecer navegação simples, organização inteligente por provas,
                    bancas, disciplinas e temas, além de histórico detalhado de respostas e acompanhamento de evolução individual.
                </p>

                <h3 className='institutional-section-title'>Nossa proposta</h3>
                <p className='institutional-paragraph'>
                    O objetivo do Questões Aqui é tornar o processo de preparação mais objetivo, recorrente e mensurável.
                    Em vez de um estudo passivo e desorganizado, oferecemos uma experiência centrada em:
                </p>
                <ul className='institutional-list'>
                    <li>Prática constante com base em questões reais.</li>
                    <li>Registro de desempenho por disciplina e tema.</li>
                    <li>Revisão direcionada a partir de erros e acertos.</li>
                    <li>Navegação clara por concursos, exames e bancas.</li>
                    <li>Ambiente leve, rápido e acessível em diferentes dispositivos.</li>
                </ul>
                <p className='institutional-paragraph'>
                    Buscamos reduzir a fricção entre o estudante e o conteúdo, facilitando a rotina de estudo e incentivando
                    a constância, um dos principais fatores de aprovação.
                </p>

                <h3 className='institutional-section-title'>Para quem é a plataforma</h3>
                <ul className='institutional-list'>
                    <li>Candidatos a concursos públicos que desejam intensificar a prática e acompanhar sua evolução.</li>
                    <li>Estudantes em preparação para avaliações acadêmicas, vestibulares ou exames específicos.</li>
                    <li>Professores e administradores que organizam simulados, provas e conteúdos para seus alunos.</li>
                    <li>Usuários que valorizam organização, clareza e acompanhamento estruturado do progresso.</li>
                </ul>

                <h3 className='institutional-section-title'>Tecnologia e evolução contínua</h3>
                <p className='institutional-paragraph'>
                    A plataforma está em constante evolução. Trabalhamos continuamente em melhorias relacionadas à experiência
                    do usuário, desempenho, autenticação, segurança e organização do conteúdo.
                </p>
                <p className='institutional-paragraph'>
                    Nossa arquitetura foi pensada para escalar com qualidade, garantindo estabilidade, proteção de dados e
                    crescimento sustentável do produto. Novas funcionalidades são adicionadas de forma planejada, sempre com
                    foco em usabilidade, simplicidade e eficiência.
                </p>

                <h3 className='institutional-section-title'>Responsável técnico</h3>
                <p className='institutional-paragraph'>
                    O Questões Aqui é um projeto mantido dentro do ecossistema SunSale System, um conjunto de soluções digitais
                    voltadas para produtividade, organização e educação. O desenvolvimento segue princípios modernos de arquitetura
                    de software, com atenção especial à qualidade técnica, segurança e manutenção de longo prazo.
                </p>
                <p className='institutional-paragraph'>
                    Nosso compromisso é entregar uma plataforma confiável, clara e eficiente, que realmente contribua para a
                    evolução dos usuários.
                </p>

                <div className='institutional-cta'>
                    <Link className='global-button global-button--transparent' to='/contato'>Entrar em contato</Link>
                </div>
            </div>
        </div>
    );
}

export default Sobre;
