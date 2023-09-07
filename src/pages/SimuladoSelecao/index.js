import { useEffect, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import api from '../../services/api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Config from '../../config.json';
import './style.css';

function SimuladoSelecao() {
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const [provas, setProvas] = useState([]);
    const [provasSelecionadas, setProvasSelecionadas] = useState([]);
    const [loadding, setLoadding] = useState(true);

    useEffect(() => {
        async function buscaProvas() {
            if (!localStorage.getItem(Config.TOKEN)) {
                toast.info('Necessário logar para acessar!');
                navigate('/', { replace: true });
                return;
            }

            await api.get('/Prova/GetSimulados')
                .then((response) => {
                    let prov = [];
                    if (response.data.success) {
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
                    navigate('/', { replace: true });
                    return;
                });
        }

        buscaProvas();
    }, []);

    const handleChange = (selectedOptions, event) => {
        setProvasSelecionadas(selectedOptions.value);
        document.getElementById('title').click();
    }

    function abreSimulado() {
        if (provasSelecionadas == '') {
            toast.warn('Selecione uma prova para iniciar!');
            return;
        }

        localStorage.setItem(Config.Historico, '');
        localStorage.removeItem(Config.Historico);
        navigate(`/questoes/simulado&${provasSelecionadas}`);
    }

    if (loadding) {
        return (
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return (
        <div className="containerpage global-fullW">
            <div className="dados global-infoPanel">
                <h2 id="title">Selecione a prova para iniciar o simulado:</h2>
                <div className='separator separator--withMargins'></div>
                <div className="opcoes">
                    <Select closeMenuOnSelect={false} components={animatedComponents} options={provas} onChange={handleChange} />
                    <button className='global-button global-button--full-width global-mt' onClick={() => abreSimulado()}>Iniciar</button>
                </div>
            </div>
        </div>
    )
}

export default SimuladoSelecao;