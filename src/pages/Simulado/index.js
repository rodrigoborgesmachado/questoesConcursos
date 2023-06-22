import { useEffect, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Config from '../../config.json';
import './style.css';

function Simulado(){
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const[provas, setProvas] = useState([]);
    const[provasSelecionadas, setProvasSelecionadas] = useState([]);
    const[loadding, setLoadding] = useState(true);

    useEffect(() => {
        async function buscaProvas(){
            if(!localStorage.getItem(Config.TOKEN)){
                toast.info('Necessário logar para acessar!');
                navigate('/', {replace: true});
                return;
            }
            
            await api.get('/Prova/GetSimulados')
            .then((response) => {
                let prov = [];
                if(response.data.success){
                    response.data.object.forEach(element => {
                        prov.push({
                            value: element.codigo,
                            label: element.nome
                        })
                    });
                    setProvas(prov);
                }
                setLoadding(false);
            }).catch(() => {
                toast.error('Erro ao buscar provas');
                navigate('/', {replace: true});
                return;
            });
        }

        buscaProvas();
    }, []);

    const handleChange = (selectedOptions, event) => {
        setProvasSelecionadas(selectedOptions.value);
        localStorage.setItem(Config.Historico, '');
        localStorage.removeItem(Config.Historico);
        navigate(`/questoes/simulado&${selectedOptions.value}`);
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

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
                <br/>
                <br/>
                Selecione sua prova:
            </h3>
            <div className="opcoes">
                <Select closeMenuOnSelect={false} components={animatedComponents} options={provas} onChange={handleChange} />
            </div>
        </div>
    )
}

export default Simulado;