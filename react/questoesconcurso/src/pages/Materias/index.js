import { useEffect, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Config from './../../config.json';
import './style.css';

function Materias(){
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const[materias, setMaterias] = useState([]);
    const[materiasSelecionadas, setMateriasSelecionadas] = useState([]);
    const[loadding, setLoadding] = useState(true);

    useEffect(() => {
        async function buscaMaterias(){
            if(!sessionStorage.getItem(Config.TOKEN)){
                toast.info('Necessário logar para acessar!');
                navigate('/', {replace: true});
                return;
            }
            
            await api.get('/Questoes/GetAllMaterias')
            .then((response) => {
                let mat = [];
                if(response.data.success){
                    response.data.object.forEach(element => {
                        mat.push({
                            value: element,
                            label: element
                        })
                    });
                    setMaterias(mat);
                }
                setLoadding(false);
            }).catch(() => {
                toast.error('Erro ao buscar matérias');
                navigate('/', {replace: true});
                return;
            });
        }

        buscaMaterias();
    }, []);

    const handleChange = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push(item.value);
        })
        setMateriasSelecionadas(temp);
    }

    function MontaUrlMaterias(){
        let t = '';

        let firt = true;
        materiasSelecionadas.forEach(item => {
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
            <h1>Matérias:</h1>
            <div className="opcoes">
                <Select closeMenuOnSelect={false} components={animatedComponents} options={materias} isMulti onChange={handleChange} />
            </div>
            <div className="continuar">
                <Link className='botao' to={`/questoes/materias&${MontaUrlMaterias()}`}>Iniciar</Link>
            </div>
        </div>
    )
}

export default Materias;