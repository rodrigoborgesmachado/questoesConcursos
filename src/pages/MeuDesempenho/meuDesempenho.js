import { useEffect, useState } from "react";
import api from '../../services/api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Config from "../../config.json";
import Modal from 'react-modal';
import { customStyles } from '../../services/functions.js';
import { abreQuestao } from '../../services/functions.js';
import BasicPie from './../../components/GraficoPie/graficoPie.js';
import { BasicBars, BarraDoisItensCorretosErrados } from '../../components/GraficoBarra/graficoBarra.js';

export default function MeuDesempenho(){
    const styles = customStyles();
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [dados, setDados] = useState({});

    async function buscaDados() {
        if (!localStorage.getItem(Config.TOKEN)) {
            toast.info('Necessário logar para acessar!');
            navigate('/', { replace: true });
            return;
        }

        await api.get('/meudesempenho/analysis')
            .then((response) => {
                setDados(response.data.object);
                setLoadding(false);
            }).catch(() => {
                toast.error('Erro ao buscar os dados');
                navigate('/', { replace: true });
                return;
            });
    }

    useEffect(() => {

        buscaDados();
    }, []);

    function criaInformacoesQuestoes(){
        return [
            {
                id:0,
                value: dados?.quantidadeQuestoesResolvidasCorretas, 
                color: 'blue',
                label: 'Respostas certas: ' + dados?.quantidadeQuestoesResolvidasCorretas
            },
            {
                id:1,
                value: dados?.quantidadeQuestoesIncorretas, 
                color: 'red',
                label: 'Respostas incorretas: ' + dados?.quantidadeQuestoesIncorretas
            }
        ]
    }

    if (loadding) {
        return (
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="containerpage global-fullW">
            <div className='dados global-infoPanel'>
                <h2>Meu Desempenho</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <div className='dadosDashboard'>
                        <h3>Questões respondidas ({dados?.quantidadeQuestoesTentadas}):</h3>
                        <div className='dadosDashboard'>
                            <BasicPie dados={criaInformacoesQuestoes()}/>
                        </div>
                    </div>
                </div>
                <br/>
                <h2>Quantidade de respostas por prova</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <BarraDoisItensCorretosErrados itens={dados?.respostasPorProvas}/>
                </div>
                <br/>
                <h2>Quantidade de respostas por matéria</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <BarraDoisItensCorretosErrados itens={dados?.respostasPorMateria}/>
                </div>
                <br/>
                <h2>Quantidade de respostas por banca</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <BarraDoisItensCorretosErrados itens={dados?.respostasPorBanca}/>
                </div>
                <br/>
                <h2>Quantidade de respostas por tipo</h2>
                <br/>
                <div className='dados global-infoPanel'>
                    <BarraDoisItensCorretosErrados itens={dados?.respostasPorTipo}/>
                </div>
                <br/>
            </div>
        </div>
    )
}