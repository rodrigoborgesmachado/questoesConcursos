import './style.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className='mainBlock'>
            <div className='insideBlock'>
                <div className='mainWrapper'>
                    <div className='containerpage-type1'>
                    <div className="containerpage-type1-text">
                    <div className='paragrafo1'>
                        Bem-vindo ao maravilhoso mundo do
                    </div>
                    <div className='paragrafo2'>
                        Questões Aqui
                    </div>
                    <div className='paragrafo3'>
                        Aqui, você vai embarcar em uma aventura incrível de preparação para o Enem, Vestibulares e concursos públicos, desvendando mistérios e desafios em forma de questões. Faça questões de concursos, questões do Enem, de vestibulares e estude observando seu progresso e podendo ter em primeira mão o que precisa para estudar.
                    </div>

                </div>
                    </div>
                
                </div>
                <div className='mainGeometric'>

                </div>
            </div>
            {/* <div className="containerpage-type1">
                <div className="containerpage-type1-text">
                    <div className='paragrafo1'>
                        Bem-vindo ao maravilhoso mundo do
                    </div>
                    <div className='paragrafo2'>
                        QuestoesAqui
                    </div>
                    <div className='paragrafo3'>
                        Aqui, você vai embarcar em uma aventura incrível de preparação para o Enem, Vestibulares e concursos públicos, desvendando mistérios e desafios em forma de questões de provas anteriores.
                    </div>

                </div>
            </div> */}
            <div className="containerpage-type3">
                <div className='containerpage-type3-block'>
                    <div className="new-h1">Intuitivo</div>
                    <div className="new-h2">Prepare-se para mergulhar em uma infinidade de perguntas surpreendentes, organizadas por disciplina e assunto. Temos um verdadeiro tesouro de questões para você praticar e se tornar um mestre da sabedoria acadêmica!</div>
                </div>
                <div className='containerpage-type3-block'>
                    <div className="new-h1">Responsivo</div>
                    <div className="new-h2">Ao longo dessa jornada, você vai poder acompanhar seu progresso e desvendar seus pontos fortes e fracos. Com as explicações detalhadas de cada questão, você vai aprimorar seus conhecimentos como um verdadeiro detetive do conhecimento!</div>
                </div>
                <div className='containerpage-type3-block'>
                    <div className="new-h1">Dinâmico</div>
                    <div className="new-h2">Então, prepare-se para os desafios acadêmicos e profissionais com o QuestoesAqui! A aventura começa agora, e estamos prontos para ajudá-lo a alcançar as estrelas do conhecimento!</div>
                </div>
            </div>

            <div className="separator"></div>

            <div className="containerpage global-extraBottom">
                <div className='botoes-type2'>
                    <Link className='botao-type2' to={`/questoes/aleatoria`}>
                        Questões aleatórias
                        <div>
                            <svg fill="inherit" width="50px" height="50px" viewBox="0 -4 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m24.983 8.539v-2.485h-4.902l-3.672 5.945-2.099 3.414-3.24 5.256c-.326.51-.889.844-1.53.845h-9.54v-3.568h8.538l3.673-5.946 2.099-3.414 3.24-5.256c.325-.509.886-.843 1.525-.845h5.904v-2.485l7.417 4.27-7.417 4.27z" /><path d="m12.902 6.316-.63 1.022-1.468 2.39-2.265-3.675h-8.538v-3.568h9.54c.641.001 1.204.335 1.526.838l.004.007 1.836 2.985z" /><path d="m24.983 24v-2.485h-5.904c-.639-.002-1.201-.336-1.521-.838l-.004-.007-1.836-2.985.63-1.022 1.468-2.39 2.264 3.675h4.902v-2.485l7.417 4.27-7.417 4.27z" /></svg>
                        </div>
                    </Link>
                    <Link className='botao-type2' to={`/questoes/enem`}>
                        Questões do ENEM
                        <div>
                            <svg fill="inherit" width="50px" height="50px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <title>pencil</title>
                                <path d="M0 32l12-4 20-20-8-8-20 20zM4 28l2.016-5.984 4 4zM8 20l12-12 4 4-12 12z"></path>
                            </svg>
                        </div>
                    </Link>
                    <Link className='botao-type2' to={`/questoes/IFTM`}>
                        Questões do IFTM
                        <div>
                            <svg width="50px" height="50px" viewBox="0 0 15 15" id="college" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5,1L0,4.5l2,0.9v1.7C1.4,7.3,1,7.9,1,8.5s0.4,1.2,1,1.4V10l-0.9,2.1&#xA; C0.8,13,1,14,2.5,14s1.7-1,1.4-1.9L3,10c0.6-0.3,1-0.8,1-1.5S3.6,7.3,3,7.1V5.9L7.5,8L15,4.5L7.5,1z M11.9,7.5l-4.5,2L5,8.4v0.1&#xA; c0,0.7-0.3,1.3-0.8,1.8l0.6,1.4v0.1C4.9,12.2,5,12.6,4.9,13c0.7,0.3,1.5,0.5,2.5,0.5c3.3,0,4.5-2,4.5-3L11.9,7.5L11.9,7.5z" />
                            </svg>
                        </div>
                    </Link>
                    <Link className='botao-type2' to={`/materias`}>
                        Selecionar questões por matéria
                        <div>
                            <svg fill="inherit" width="50px" height="50px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <title>alt-book</title>
                                <path d="M0 26.016q0 0.832 0.576 1.408t1.44 0.576q1.92 0.096 3.808 0.288t4.352 0.736 3.904 1.28q0.096 0.736 0.64 1.216t1.28 0.48 1.28-0.48 0.672-1.216q1.44-0.736 3.872-1.28t4.352-0.736 3.84-0.288q0.8 0 1.408-0.576t0.576-1.408v-24q0-0.832-0.576-1.408t-1.408-0.608q-0.032 0-0.096 0.032t-0.128 0q-9.504 0.256-12.672 2.528-1.024 0.768-1.12 1.44l-0.096-0.32q-0.576-1.28-3.168-2.176-3.648-1.28-10.528-1.472-0.064 0-0.128 0t-0.064-0.032q-0.832 0-1.44 0.608t-0.576 1.408v24zM4 24.128v-19.936q6.88 0.512 10.016 2.080v19.744q-3.104-1.536-10.016-1.888zM6.016 20q0.096 0 0.32 0.032t0.832 0.032 1.216 0.096 1.248 0.224 1.184 0.352 0.832 0.544 0.352 0.736v-4q0-0.096-0.032-0.224t-0.352-0.48-0.896-0.608-1.792-0.48-2.912-0.224v4zM6.016 12q0.096 0 0.32 0.032t0.832 0.032 1.216 0.096 1.248 0.224 1.184 0.352 0.832 0.544 0.352 0.736v-4q0-0.096-0.032-0.224t-0.352-0.48-0.896-0.608-1.792-0.48-2.912-0.224v4zM18.016 26.016v-19.744q3.104-1.568 9.984-2.080v19.936q-6.912 0.352-9.984 1.888zM20 22.016q0-0.576 0.608-0.992t1.504-0.576 1.76-0.288 1.504-0.128l0.64-0.032v-4q-1.696 0-2.944 0.224t-1.792 0.48-0.864 0.608-0.384 0.512l-0.032 0.192v4zM20 14.016q0-0.576 0.608-0.992t1.504-0.576 1.76-0.288 1.504-0.128l0.64-0.032v-4q-1.696 0-2.944 0.224t-1.792 0.48-0.864 0.608-0.384 0.512l-0.032 0.192v4z"></path>
                            </svg>
                        </div>
                    </Link>
                    <Link className='botao-type2' to={`/bancas`}>
                        Selecionar questões por bancas
                        <div>
                            <svg fill="inherit" width="50px" height="50px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <title>alt-clipboard</title>
                                <path d="M2.016 30.016v-26.016q0-0.832 0.576-1.408t1.408-0.576h4v4h-1.984v21.984h20v-21.984h-2.016v-4h4q0.832 0 1.408 0.576t0.608 1.408v26.016q0 0.832-0.608 1.408t-1.408 0.576h-24q-0.832 0-1.408-0.576t-0.576-1.408zM8 26.016v-18.016h2.016q0 0.832 0.576 1.44t1.408 0.576h8q0.832 0 1.408-0.576t0.608-1.44h1.984v18.016h-16zM10.016 22.016h9.984v-2.016h-9.984v2.016zM10.016 18.016h8v-2.016h-8v2.016zM10.016 14.016h12v-2.016h-12v2.016zM10.016 6.016v-4h4v-2.016h4v2.016h4v4q0 0.832-0.608 1.408t-1.408 0.576h-8q-0.832 0-1.408-0.576t-0.576-1.408zM14.016 6.016h4v-2.016h-4v2.016z"></path>
                            </svg>
                        </div>
                    </Link>
                    <Link className='botao-type2' to={`/simulado`}>
                        Fazer simulado
                        <div>
                            <svg fill="inherit" width="50px" height="50px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <title>pencil</title>
                                <path d="M0 32l12-4 20-20-8-8-20 20zM4 28l2.016-5.984 4 4zM8 20l12-12 4 4-12 12z"></path>
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>

            {/* <div className="containerpage global-fullW">
                <div className='botoes'>
                    <Link className='botao' to={`/questoes/aleatoria`}>Iniciar com questões aleatórias</Link>
                    <Link className='botao' to={`/questoes/enem`}>Iniciar com questões do ENEM</Link>
                    <Link className='botao' to={`/questoes/IFTM`}>Iniciar com questões do IFTM</Link>
                    <Link className='botao' to={`/materias`}>Selecionar questões por matéria</Link>
                    <Link className='botao' to={`/bancas`}>Selecionar questões por bancas</Link>
                    <Link className='botao' to={`/simulado`}>Fazer simulado</Link>
                </div>
            </div> */}
        </div>

    )
}

export default Home;