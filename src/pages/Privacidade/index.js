import { Link } from 'react-router-dom';
import '../Institucional/style.css';

function Privacidade() {
    return (
        <div className='containerpage global-fullW institutional-page'>
            <div className='global-infoPanel institutional-card'>
                <h2 className='institutional-title'>Política de Privacidade</h2>

                <p className='institutional-paragraph'>
                    O Questões Aqui valoriza a privacidade e a proteção dos dados pessoais de seus usuários. Esta Política
                    de Privacidade descreve de forma transparente como coletamos, utilizamos, armazenamos e protegemos as
                    informações fornecidas durante a utilização da plataforma.
                </p>
                <p className='institutional-paragraph'>
                    Ao acessar ou utilizar o Questões Aqui, você declara estar ciente e de acordo com as práticas descritas
                    nesta política.
                </p>

                <h3 className='institutional-section-title'>Dados coletados</h3>
                <p className='institutional-paragraph'>
                    Para garantir o funcionamento adequado da plataforma, podemos coletar diferentes categorias de dados:
                </p>
                <p className='institutional-paragraph'>
                    a) Dados de cadastro: informações fornecidas diretamente pelo usuário no momento da criação de conta ou
                    atualização de perfil, como nome, e-mail, perfil de acesso e outras informações necessárias para autenticação.
                </p>
                <p className='institutional-paragraph'>
                    b) Dados técnicos: informações automaticamente coletadas durante o acesso à plataforma, como endereço IP,
                    tipo de navegador, dispositivo utilizado, sistema operacional, data e hora de acesso e registros de logs.
                </p>
                <p className='institutional-paragraph'>
                    c) Dados de uso e desempenho: informações relacionadas à utilização da plataforma, incluindo respostas
                    fornecidas, histórico de questões, progresso, interações, métricas de desempenho e preferências de navegação.
                </p>

                <h3 className='institutional-section-title'>Finalidade do tratamento dos dados</h3>
                <p className='institutional-paragraph'>Os dados coletados são utilizados para:</p>
                <ul className='institutional-list'>
                    <li>Realizar autenticação e gerenciamento de contas.</li>
                    <li>Garantir segurança e integridade da plataforma.</li>
                    <li>Permitir o funcionamento das funcionalidades disponíveis.</li>
                    <li>Personalizar a experiência do usuário.</li>
                    <li>Gerar métricas internas e análises de desempenho.</li>
                    <li>Desenvolver melhorias contínuas na plataforma.</li>
                    <li>Cumprir obrigações legais e regulatórias, quando aplicável.</li>
                </ul>
                <p className='institutional-paragraph'>
                    O tratamento de dados ocorre de acordo com as bases legais previstas na legislação aplicável, incluindo a
                    Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>

                <h3 className='institutional-section-title'>Compartilhamento de informações</h3>
                <p className='institutional-paragraph'>O Questões Aqui não comercializa dados pessoais.</p>
                <p className='institutional-paragraph'>
                    O compartilhamento de informações poderá ocorrer apenas nas seguintes hipóteses:
                </p>
                <ul className='institutional-list'>
                    <li>Quando necessário para a operação técnica da plataforma (como serviços de hospedagem e infraestrutura).</li>
                    <li>Para cumprimento de obrigação legal ou determinação judicial.</li>
                    <li>Para prevenção de fraudes, abusos ou atividades ilícitas.</li>
                    <li>Para proteção dos direitos do usuário ou da própria plataforma.</li>
                </ul>
                <p className='institutional-paragraph'>Sempre que possível, o compartilhamento será limitado ao mínimo necessário.</p>

                <h3 className='institutional-section-title'>Armazenamento e segurança</h3>
                <p className='institutional-paragraph'>
                    Adotamos medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra acessos não
                    autorizados, vazamentos, alterações indevidas ou destruição.
                </p>
                <p className='institutional-paragraph'>
                    Apesar dos esforços contínuos para garantir segurança, nenhum sistema é completamente imune a riscos.
                    Recomendamos que os usuários utilizem senhas fortes, mantenham seus dados de acesso protegidos e não
                    compartilhem credenciais com terceiros.
                </p>
                <p className='institutional-paragraph'>
                    Os dados são armazenados pelo período necessário para cumprimento das finalidades descritas nesta política,
                    respeitando prazos legais aplicáveis.
                </p>

                <h3 className='institutional-section-title'>Direitos do titular dos dados</h3>
                <p className='institutional-paragraph'>Nos termos da legislação aplicável, o usuário pode, a qualquer momento:</p>
                <ul className='institutional-list'>
                    <li>Solicitar confirmação da existência de tratamento de dados.</li>
                    <li>Solicitar acesso às informações armazenadas.</li>
                    <li>Solicitar correção de dados incompletos, inexatos ou desatualizados.</li>
                    <li>Solicitar anonimização, bloqueio ou exclusão de dados, quando aplicável.</li>
                    <li>Solicitar informações sobre compartilhamentos realizados.</li>
                    <li>Revogar consentimento, quando o tratamento estiver baseado nessa hipótese.</li>
                </ul>
                <p className='institutional-paragraph'>
                    As solicitações poderão ser realizadas pelos canais de contato disponibilizados na plataforma.
                </p>

                <h3 className='institutional-section-title'>Cookies e tecnologias similares</h3>
                <p className='institutional-paragraph'>
                    A plataforma pode utilizar cookies e tecnologias similares para melhorar a experiência de navegação,
                    analisar métricas de uso e manter funcionalidades essenciais.
                </p>
                <p className='institutional-paragraph'>
                    O usuário pode configurar seu navegador para recusar ou limitar o uso de cookies, ciente de que determinadas
                    funcionalidades podem ser impactadas.
                </p>

                <h3 className='institutional-section-title'>Atualizações desta política</h3>
                <p className='institutional-paragraph'>
                    Esta Política de Privacidade pode ser atualizada periodicamente para refletir melhorias na plataforma,
                    alterações legais ou ajustes operacionais.
                </p>
                <p className='institutional-paragraph'>
                    Recomendamos que o usuário revise este conteúdo regularmente. A data da última atualização poderá ser
                    indicada ao final do documento.
                </p>

                <p className='institutional-paragraph'>Última atualização: 02/03/2026</p>

                <div className='institutional-cta'>
                    <Link className='global-button global-button--transparent' to='/contato'>Falar com o suporte</Link>
                </div>
            </div>
        </div>
    );
}

export default Privacidade;

