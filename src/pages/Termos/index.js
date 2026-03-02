import { Link } from 'react-router-dom';
import '../Institucional/style.css';

function Termos() {
    return (
        <div className='containerpage global-fullW institutional-page'>
            <div className='global-infoPanel institutional-card'>
                <h2 className='institutional-title'>Termos de Uso</h2>

                <p className='institutional-paragraph'>
                    Estes Termos de Uso regulam o acesso e utilização da plataforma Questões Aqui.
                    Ao utilizar o serviço, você declara ciência e concordância com as condições abaixo.
                </p>

                <h3 className='institutional-section-title'>1. Uso da plataforma</h3>
                <ul className='institutional-list'>
                    <li>Você é responsável pelas informações fornecidas durante o cadastro.</li>
                    <li>Não é permitido uso da plataforma para fins ilícitos ou abusivos.</li>
                    <li>É vedada qualquer tentativa de violar segurança, disponibilidade ou integridade do serviço.</li>
                </ul>

                <h3 className='institutional-section-title'>2. Conta e credenciais</h3>
                <p className='institutional-paragraph'>
                    A guarda da senha e das credenciais é de responsabilidade do usuário.
                    Atividades realizadas com sua conta serão consideradas de sua autoria, salvo prova em contrário.
                </p>

                <h3 className='institutional-section-title'>3. Propriedade intelectual</h3>
                <p className='institutional-paragraph'>
                    Interface, marca, estrutura técnica e conteúdos próprios da plataforma são protegidos por lei.
                    A reprodução ou distribuição sem autorização expressa não é permitida.
                </p>

                <h3 className='institutional-section-title'>4. Disponibilidade e manutenção</h3>
                <p className='institutional-paragraph'>
                    A plataforma pode passar por atualizações, correções e períodos de manutenção.
                    Embora busquemos alta disponibilidade, não há garantia de funcionamento ininterrupto.
                </p>

                <h3 className='institutional-section-title'>5. Limitação de responsabilidade</h3>
                <p className='institutional-paragraph'>
                    A plataforma é oferecida para apoio educacional e prática.
                    Resultados em provas, concursos e avaliações dependem de múltiplos fatores externos,
                    não sendo garantidos pela equipe responsável.
                </p>

                <h3 className='institutional-section-title'>6. Alterações dos termos</h3>
                <p className='institutional-paragraph'>
                    Estes termos podem ser modificados para refletir melhorias de produto, exigências legais
                    ou ajustes operacionais. A continuidade no uso após publicação indica aceitação da versão vigente.
                </p>

                <div className='institutional-cta'>
                    <Link className='global-button global-button--transparent' to='/privacidade'>Ver Política de Privacidade</Link>
                </div>
            </div>
        </div>
    );
}

export default Termos;

