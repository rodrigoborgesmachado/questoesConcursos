import { useEffect, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Config from "./../../config.json";
import './style.css';

function Bancas(){
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const[bancas, setBancas] = useState([]);
    const[bancasSelecionadas, setBancasSelecionadas] = useState([]);
    const[loadding, setLoadding] = useState(true);

    useEffect(() => {
        async function buscaBancas(){
            if(!localStorage.getItem(Config.TOKEN)){
                toast.info('Necessário logar para acessar!');
                navigate('/', {replace: true});
                return;
            }

            await api.get('/Prova/GetAllBancas')
            .then((response) => {
                let banca = [];
                response.data.object.forEach(element => {
                    banca.push({
                        value: element,
                        label: element
                    })
                });
                setBancas(banca);
                setLoadding(false);
            }).catch(() => {
                toast.error('Erro ao buscar bancas');
                navigate('/', {replace: true});
                return;
            });
        }

        buscaBancas();
    }, []);

    const handleChange = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push(item.value);
        })
        setBancasSelecionadas(temp);
    }

    function MontaUrlBancas(){
        let t = '';

        let firt = true;
        bancasSelecionadas.forEach(item => {
            if(firt) firt = false;
            else t+=';';
            t += item;
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
            <h1>Bancas:</h1>
            <div className="opcoes">
                <Select closeMenuOnSelect={false} components={animatedComponents} options={bancas} isMulti onChange={handleChange} />
            </div>
            <div className="continuar">
                <Link className='botao' to={`/questoes/bancas&${MontaUrlBancas()}`}>Iniciar</Link>
            </div>
        </div>
    )
}

export default Bancas;