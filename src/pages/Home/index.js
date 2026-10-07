import './style.css';
import { Link } from 'react-router-dom';
import Config from './../../config.json';
import { useEffect } from 'react';

const resources = [
    { title: 'Banco de questões', text: 'Consulte enunciados e alternativas de questões de concursos, Enem e vestibulares. Use os filtros disponíveis para direcionar sua pesquisa e escolher o que estudar.', to: '/listagemquestoes', action: 'Explorar questões' },
    { title: 'Provas anteriores', text: 'Conheça a organização de uma prova e os conteúdos cobrados. Estudar provas anteriores ajuda a reconhecer o estilo das perguntas e a planejar a revisão.', to: '/listagemprovas', action: 'Consultar provas' },
    { title: 'Simulados e prática', text: 'Com uma conta, pratique questões e realize simulados. No modo simulado, confira o resultado ao final para avaliar seus acertos e os assuntos que merecem atenção.', to: '/simulado', action: 'Realizar um simulado' },
];

const questions = [
    { title: 'Posso consultar questões sem criar uma conta?', text: 'Sim. A listagem de questões, a consulta de provas e as páginas públicas de questões podem ser acessadas sem login. Para responder no modo de prática, realizar simulados e acessar seu histórico pessoal, entre na sua conta.' },
    { title: 'Qual é a diferença entre praticar e fazer um simulado?', text: 'Na prática, você trabalha as questões e recebe retorno sobre as respostas. No simulado, as respostas são conferidas ao final. Use a prática para revisar conteúdos e o simulado para exercitar a resolução de uma sequência de questões.' },
    { title: 'Como escolher as questões para estudar?', text: 'Comece pelo conteúdo previsto no edital ou pela área de conhecimento da sua prova. Consulte o banco de questões e as provas disponíveis, aplicando os filtros que correspondem ao seu objetivo. Alterne assuntos já estudados com aqueles em que você encontra dificuldade.' },
    { title: 'Resolver questões substitui o estudo da teoria?', text: 'A resolução complementa o estudo teórico. Quando errar ou acertar por dúvida, retome o conceito em seu material de estudo e tente explicar o raciocínio com suas próprias palavras. Depois, resolva outras questões sobre o mesmo tema.' },
    { title: 'O Questões Aqui é um site oficial de concursos ou do Enem?', text: 'Não. O Questões Aqui é uma plataforma educacional da SunSale System. Para datas, regras, inscrições e conteúdos oficiais, consulte o Inep, a instituição de ensino ou a organizadora responsável pelo processo seletivo.' },
];

function Home() {
    useEffect(() => {
        localStorage.setItem(Config.lastLink, '/');
    }, []);

    return (
        <main className='home-page'>
            <section className='home-hero' aria-labelledby='home-title'>
                <div>
                    <p className='home-eyebrow'>Questões Aqui · Sua rotina de estudos começa aqui</p>
                    <h1 id='home-title'>Questões de concursos, Enem e vestibulares para estudar e praticar</h1>
                    <p>Transforme o conteúdo que você estuda em prática. No Questões Aqui, você pode consultar questões e provas, testar seus conhecimentos e organizar a preparação para o seu próximo desafio.</p>
                    <p>Escolha um assunto, resolva com atenção e use seus resultados para decidir o que revisar. Uma rotina consistente começa com um passo possível hoje.</p>
                    <div className='home-actions'>
                        <Link className='home-button' to='/listagemquestoes'>Explorar questões</Link>
                        <Link className='home-button home-button-secondary' to='/criarUsuario'>Criar minha conta</Link>
                    </div>
                    <p className='home-note'>Consulte questões e provas sem login. Entre na sua conta para praticar e acompanhar seu histórico.</p>
                </div>
                <aside className='home-plan' aria-labelledby='home-plan-title'>
                    <span className='home-eyebrow'>Um passo de cada vez</span>
                    <h2 id='home-plan-title'>Seu próximo bloco de estudo</h2>
                    <ol>
                        <li><strong>Escolha um tema</strong><span>Defina o conteúdo que você quer revisar.</span></li>
                        <li><strong>Resolva com atenção</strong><span>Leia o enunciado e analise as alternativas.</span></li>
                        <li><strong>Aprenda com o resultado</strong><span>Revise as dúvidas antes de seguir em frente.</span></li>
                    </ol>
                    <Link to='/listagemprovas'>Encontre uma prova para começar →</Link>
                </aside>
            </section>

            <section className='home-section' aria-labelledby='home-resources-title'>
                <p className='home-eyebrow'>Conheça a plataforma</p>
                <h2 id='home-resources-title'>Recursos para cada etapa da preparação</h2>
                <div className='home-grid'>
                    {resources.map((resource) => (
                        <article className='home-card' key={resource.to}>
                            <h3>{resource.title}</h3>
                            <p>{resource.text}</p>
                            <Link to={resource.to}>{resource.action} →</Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className='home-section home-panel' aria-labelledby='home-study-title'>
                <p className='home-eyebrow'>Estude com intenção</p>
                <h2 id='home-study-title'>Como aproveitar melhor o estudo por questões</h2>
                <p>Questões ajudam a perceber como um conteúdo aparece na prova. Mais do que contar acertos, procure entender o caminho até a resposta: quais informações do enunciado são relevantes, qual conceito está sendo cobrado e por que as outras alternativas não se aplicam.</p>
                <div className='home-grid'>
                    <article>
                        <h3>Antes de resolver</h3>
                        <p>Defina um objetivo pequeno e claro, como revisar interpretação de texto ou um tópico de matemática. Separe seu material de apoio e escolha um conjunto de questões compatível com o tempo que você tem disponível.</p>
                    </article>
                    <article>
                        <h3>Durante a prática</h3>
                        <p>Tente responder antes de consultar a teoria. Observe palavras que mudam o sentido da pergunta, unidades de medida e condições do problema. Registre as dúvidas e diferencie uma resposta segura de um acerto por tentativa.</p>
                    </article>
                    <article>
                        <h3>Depois de responder</h3>
                        <p>Classifique seus erros: falta de conteúdo, interpretação ou distração. Retome os assuntos necessários e volte a praticá-los em outra sessão. Use o histórico e os resultados disponíveis na sua conta para orientar a revisão.</p>
                    </article>
                </div>
            </section>

            <section className='home-section' aria-labelledby='home-goals-title'>
                <h2 id='home-goals-title'>Direcione a prática para o seu objetivo</h2>
                <div className='home-grid'>
                    <article className='home-card'>
                        <h3>Concursos públicos</h3>
                        <p>Use o edital como referência para organizar as disciplinas. Consulte as provas disponíveis e observe a forma como os assuntos são cobrados. Combine revisão da teoria com exercícios, dando atenção aos temas em que seus erros se repetem.</p>
                        <Link to='/listagemprovas'>Pesquisar provas →</Link>
                    </article>
                    <article className='home-card'>
                        <h3>Enem</h3>
                        <p>Pratique leitura, interpretação de gráficos e aplicação de conceitos em diferentes contextos. Ao revisar, identifique a habilidade exigida pela questão. Reserve também tempo para a redação e para os demais conteúdos previstos na preparação.</p>
                        <Link to='/questoes/enem?page=1&Tipo=Enem&randon=true'>Praticar questões do Enem →</Link>
                    </article>
                    <article className='home-card'>
                        <h3>Vestibulares e processos seletivos</h3>
                        <p>Consulte as orientações da instituição e estude as provas anteriores disponíveis. Compare os assuntos exigidos com seu plano de estudos e pratique a leitura dos enunciados. Para processos do IFTM, há também um acesso direto ao modo de questões.</p>
                        <Link to='/questoes/IFTM?page=1&Tipo=IFTM&randon=true'>Praticar questões do IFTM →</Link>
                    </article>
                </div>
            </section>

            <section className='home-section home-faq' aria-labelledby='home-faq-title'>
                <h2 id='home-faq-title'>Dúvidas frequentes</h2>
                {questions.map((question) => (
                    <details key={question.title}>
                        <summary>{question.title}</summary>
                        <p>{question.text}</p>
                    </details>
                ))}
            </section>

            <nav className='home-section home-panel home-map' aria-labelledby='home-map-title'>
                <h2 id='home-map-title'>Mapa do site</h2>
                <p>Encontre os recursos de estudo e as informações sobre a plataforma.</p>
                <div className='home-grid'>
                    <div><h3>Estudar</h3><Link to='/listagemquestoes'>Banco de questões</Link><Link to='/listagemprovas'>Provas anteriores</Link><Link to='/questoes/aleatoria?page=1&Tipo=Generic&randon=true'>Questões aleatórias (com login)</Link><Link to='/simulado'>Simulados (com login)</Link></div>
                    <div><h3>Planejar</h3><Link to='/calculadoraEnem'>Calculadora Enem</Link><Link to='/notasCorte'>Notas de corte</Link><Link to='/criarUsuario'>Criar conta</Link><Link to='/login'>Entrar na plataforma</Link></div>
                    <div><h3>Conhecer</h3><Link to='/sobre'>Sobre o Questões Aqui</Link><Link to='/contato'>Contato e sugestões</Link><Link to='/privacidade'>Política de privacidade</Link><Link to='/termos'>Termos de uso</Link></div>
                </div>
            </nav>
        </main>
    );
}

export default Home;
