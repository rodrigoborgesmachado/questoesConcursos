import { useEffect, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './style.css';

function Provas(){
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const[provas, setProvas] = useState([]);
    const[provasSelecionadas, setProvasSelecionadas] = useState([]);
    const[loadding, setLoadding] = useState(true);

    useEffect(() => {
        async function buscaProvas(){
            await api.get('/BuscarProvas.php')
            .then((response) => {
                let prov = [];
                if(response.data.Sucesso){
                    response.data.lista.forEach(element => {
                        prov.push({
                            value: element.Codigo,
                            label: element.Nomeprova
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
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push(item.value);
        })
        setProvasSelecionadas(temp);
    }

    function MontaUrlprovas(){
        let t = '';

        provasSelecionadas.forEach(item => {
            if(t === '')
                t = item;
        })

        return t;
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
            <h1>Provas:</h1>
            <div className="opcoes">
                <Select closeMenuOnSelect={false} components={animatedComponents} options={provas} isMulti onChange={handleChange} />
            </div>
            <div className="continuar">
                <Link className='botao' to={`/questoes/provas&${MontaUrlprovas()}`}>Iniciar</Link>
            </div>
        </div>
    )
}

export default Provas;