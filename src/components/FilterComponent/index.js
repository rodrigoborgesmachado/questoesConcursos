import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';

const filtroBanca=1;
const filtroProva=2;
const filtroMateria=3;
const filtroAssuntos=4;

function FilterComponent({ buscaQuestoesFiltrando, setFiltro, showBancas=true, showMaterias = true, showAssuntos=true, showProvas=true }){
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const[loadding, setLoadding] = useState(true);
    const [bancas, setBancas] = useState([]);
    const [selectedBancas, setSelectedBancas] = useState(localStorage.getItem(Config.filtroBancasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroBancasSelecionadas)) : []);
    const [materias, setMaterias] = useState([]);
    const [selectedMaterias, setSelectedMaterias] = useState(localStorage.getItem(Config.filtroMateriasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroMateriasSelecionadas)) : []);
    const [assuntos, setAssuntos] = useState([]);
    const [selectedAssuntos, setSelectedAssuntos] = useState(localStorage.getItem(Config.filtroAssuntosSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroAssuntosSelecionadas)) : []);
    const [provas, setProvas] = useState([]);
    const [selectedProvas, setSelectedProvas] = useState(localStorage.getItem(Config.filtroProvasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroProvasSelecionadas)) : []);

    useEffect(() => {
        setLoadding(true);

        buscaDadosFiltro(filtroBanca);
        buscaDadosFiltro(filtroProva);
        buscaDadosFiltro(filtroMateria);
        buscaDadosFiltro(filtroAssuntos);

        setLoadding(false);
    }, [])

    useEffect(() => {
        buscaDadosFiltro(filtroBanca);
        buscaDadosFiltro(filtroMateria);
        buscaDadosFiltro(filtroAssuntos);
        localStorage.setItem(Config.filtroProvasSelecionadas, JSON.stringify(selectedProvas));
    }, [selectedProvas]);

    useEffect(() => {
        buscaDadosFiltro(filtroProva);
        buscaDadosFiltro(filtroMateria);
        buscaDadosFiltro(filtroAssuntos);
        localStorage.setItem(Config.filtroBancasSelecionadas, JSON.stringify(selectedBancas));
    }, [selectedBancas]);

    useEffect(() => {
        buscaDadosFiltro(filtroBanca);
        buscaDadosFiltro(filtroProva);
        buscaDadosFiltro(filtroAssuntos);
        localStorage.setItem(Config.filtroMateriasSelecionadas, JSON.stringify(selectedMaterias));
    }, [selectedMaterias]);

    useEffect(() => {
        buscaDadosFiltro(filtroBanca);
        buscaDadosFiltro(filtroProva);
        buscaDadosFiltro(filtroMateria);
        localStorage.setItem(Config.filtroAssuntosSelecionadas, JSON.stringify(selectedAssuntos));
    }, [selectedAssuntos]);

    const handleChangeSelectProva = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                codigoProva: item.value
            }
            );
        })

        setSelectedProvas(selectedOptions);
    }

    const handleChangeSelectMateria = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                materia: item.value
            }
            );
        })

        setSelectedMaterias(selectedOptions);
    }

    const handleChangeSelectBanca = async (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                banca: item.value
            }
            );
        })

        setSelectedBancas(selectedOptions);
    }

    const handleChangeSelectAssunto = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                materia: item.value
            }
            );
        })

        setSelectedAssuntos(selectedOptions);
    }

    function montaBusca(){
        var retorno = '';

        if(selectedProvas.length > 0){
            retorno += "&provas="
            selectedProvas.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        if(selectedMaterias.length > 0){
            retorno += "&materias="
            selectedMaterias.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        if(selectedBancas.length > 0){
            retorno += "&bancas="
            selectedBancas.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        if(selectedAssuntos.length > 0){
            retorno += "&assuntos="
            selectedAssuntos.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        setFiltro(retorno);
        return retorno;
    }

    function jump(tipo){
        if(tipo == filtroAssuntos)
            return !showAssuntos;
        if(tipo == filtroBanca)
            return !showBancas;
        if(tipo == filtroMateria)
            return !showMaterias;
        if(tipo == filtroProva)
            return !showProvas;
    }

    async function buscaDadosFiltro(tipo){
        let url = '';

        if(jump(tipo)){
            return;
        }

        if(tipo == filtroBanca){
            url = '/Prova/GetAllBancas';
        }
        else if(tipo == filtroProva){
            url = '/Prova/GetAllProvasName';
        }
        else if(tipo == filtroMateria){
            url = '/Prova/GetAllMaterias';
        }
        else{
            url = '/Prova/GetAllAssuntos';
        }

        await api.get(url + '?1=1' + montaBusca())
        .then((response) => {
            if(response.data.success){
                var t = [];
                response.data.object.forEach(element => {
                    t.push({
                        value: element,
                        label: element
                    })
                });

                if(tipo == filtroBanca){
                    setBancas(t);
                }
                else if(tipo == filtroProva){
                    setProvas(t);
                }
                else if(tipo == filtroMateria){
                    setMaterias(t);
                }
                else{
                    setAssuntos(t);
                }
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar filtros');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar filtros');
        })
    }

    async function limparFiltro(){
        setSelectedAssuntos([]);
        setSelectedBancas([]);
        setSelectedMaterias([]);
        setSelectedProvas([]);
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className='global-pageContainer-left'>
            <div className='contextModal'>
                <div className='bodymodal'>
                    <h3>Filtros</h3>
                </div>
                <div className="separator separator--withMargins"></div>
                <div className='filtros-questoes'>
                    {
                        showBancas ? 
                        <>
                            <h4>Bancas:</h4>
                            <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={bancas} value={selectedBancas} isMulti onChange={handleChangeSelectBanca} />
                        </>
                        :<></>
                    }
                    
                    {
                        showProvas ?
                        <>
                            <h4>Provas:</h4>
                            <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={provas} value={selectedProvas} isMulti onChange={handleChangeSelectProva} />
                        </>
                        :<></>
                    }
                    
                    {
                        showMaterias ?
                        <>
                            <h4>Matérias:</h4>
                            <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={materias} value={selectedMaterias} isMulti onChange={handleChangeSelectMateria} />
                        </>
                        :<></>
                    }

                    {
                        showAssuntos ?
                        <>
                            <h4>Assuntos:</h4>
                            <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={assuntos} value={selectedAssuntos} isMulti onChange={handleChangeSelectAssunto} />
                        </>
                        :<></>
                    }
                </div>
                <div className='botoesModalFiltro'>
                    <button className='global-button global-button--transparent' onClick={limparFiltro}>Limpar</button>
                    <button className='global-button global-button' onClick={buscaQuestoesFiltrando}>Filtrar</button>
                </div>
            </div>
        </div>
    );
}

export default FilterComponent;