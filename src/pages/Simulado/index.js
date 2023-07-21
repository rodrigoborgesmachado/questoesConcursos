import './style.css';
import { useNavigate } from 'react-router-dom';

function Simulado(){
    const navigate = useNavigate();

    return (
        <div className="containerpage">
            <h1>Simulados:</h1>
            <h3>
                Desafie-se com o emocionante modo simulado! 🚀✨ Prepare-se para uma aventura cheia de perguntas desafiadoras e mistérios a serem desvendados. Com o modo simulado do nosso site, você terá a oportunidade de testar seus conhecimentos sem se preocupar em verificar se a resposta está correta. Deixe a curiosidade guiar você enquanto mergulha de cabeça nas questões estimulantes. 🔍🧠
                <br/>
                <br/>
                À medida que você avança no simulado, sinta a emoção aumentar a cada pergunta respondida. Será que você está no caminho certo? 🤔 As respostas permanecerão um mistério até o final do simulado. Aí, e somente aí, todos os segredos serão revelados, e você poderá desvendar seu desempenho com um resultado abrangente. 📊🔒
                <br/>
                <br/>
                Aproveite essa jornada cheia de desafios e aprendizado. O modo simulado é perfeito para aqueles que desejam testar seus limites, afiar suas habilidades e buscar um aprimoramento constante. Não se preocupe com erros no caminho, pois eles fazem parte da jornada rumo à excelência! 🌟❌
                <br/>
                <br/>
                Prepare-se para explorar o desconhecido, colocar suas habilidades à prova e descobrir seu potencial oculto. Entre no modo simulado agora mesmo e embarque em uma aventura educativa como nunca antes! 🚀🎓✨
                <button className='botao' onClick={() => navigate('/simuladoselecao',{replace: true})}>Selecione sua prova</button>
            </h3>
        </div>
    )
}

export default Simulado;