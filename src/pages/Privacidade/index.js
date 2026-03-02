import { Link } from 'react-router-dom';
import '../Institucional/style.css';

function Privacidade() {
    return (
        <div className='containerpage global-fullW institutional-page'>
            <div className='global-infoPanel institutional-card'>
                <h2 className='institutional-title'>Política de Privacidade</h2>

                <p className='institutional-paragraph'>
                    Esta política descreve como o Questões Aqui trata dados pessoais e informações de uso.
                    Ao continuar navegando e utilizando a plataforma, você concorda com os termos descritos nesta página.
                </p>

                <h3 className='institutional-section-title'>1. Dados coletados</h3>
                <p className='institutional-paragraph'>
                    Podemos coletar dados de cadastro (como nome, e-mail e perfil de acesso), dados técnicos
                    (navegador, dispositivo e logs) e dados de uso (respostas, progresso e interações com questões).
                </p>

                <h3 className='institutional-section-title'>2. Finalidade do uso</h3>
                <p className='institutional-paragraph'>
                    Os dados são utilizados para autenticação, segurança da conta, funcionamento das funcionalidades,
                    personalização da experiência, geração de métricas internas e melhoria contínua da plataforma.
                </p>

                <h3 className='institutional-section-title'>3. Compartilhamento</h3>
                <p className='institutional-paragraph'>
                    Não comercializamos dados pessoais. O compartilhamento pode ocorrer apenas quando necessário
                    para operação técnica, cumprimento legal, prevenção de fraude ou proteção da plataforma.
                </p>

                <h3 className='institutional-section-title'>4. Armazenamento e segurança</h3>
                <p className='institutional-paragraph'>
                    Adotamos medidas razoáveis de segurança para proteger as informações armazenadas.
                    Ainda assim, nenhum sistema é totalmente imune a riscos, e recomendamos boas práticas
                    de senha e uso seguro da conta.
                </p>

                <h3 className='institutional-section-title'>5. Direitos do titular</h3>
                <ul className='institutional-list'>
                    <li>Solicitar confirmação de tratamento de dados.</li>
                    <li>Solicitar correção de informações desatualizadas.</li>
                    <li>Solicitar exclusão de dados quando aplicável.</li>
                    <li>Solicitar informações sobre compartilhamentos, quando houver.</li>
                </ul>

                <h3 className='institutional-section-title'>6. Atualizações desta política</h3>
                <p className='institutional-paragraph'>
                    Esta política pode ser atualizada periodicamente. Recomendamos revisar este conteúdo
                    de tempos em tempos para acompanhar mudanças relevantes.
                </p>

                <div className='institutional-cta'>
                    <Link className='global-button global-button--transparent' to='/contato'>Falar com o suporte</Link>
                </div>
            </div>
        </div>
    );
}

export default Privacidade;

