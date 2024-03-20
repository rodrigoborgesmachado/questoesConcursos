import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { MontaFiltrosLocalSession, LimpaFiltrosLocalSession } from '../../services/functions.js';

const filtroBanca=1;
const filtroProva=2;
const filtroMateria=3;
const filtroAssuntos=4;
const filtroProfessores=5;
const filtroTipos=6;

function FilterComponent({ buscaQuestoesFiltrando, setFiltro, showBancas=true, showMaterias = true, showAssuntos=true, showProvas=true, showProfessores=false, showTipos=true }){
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
    const [professores, setProfessores] = useState([]);
    const [selectedProfessores, setSelectedProfessores] = useState(localStorage.getItem(Config.filtroProfessoresSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroProfessoresSelecionadas)) : []);
    const [tipos, setTipos] = useState([]);
    const [selectedtipos, setSelectedTipos] = useState(localStorage.getItem(Config.filtroTiposSelecionados) ? JSON.parse(localStorage.getItem(Config.filtroTiposSelecionados)) : []);
    const [first, setFirst] = useState(true);
    useEffect(() => {
        setLoadding(true);

        buscaDadosFiltro(filtroBanca);
        buscaDadosFiltro(filtroProva);
        buscaDadosFiltro(filtroMateria);
        buscaDadosFiltro(filtroAssuntos);
        buscaDadosFiltro(filtroProfessores);
        buscaDadosFiltro(filtroTipos);

        setLoadding(false);
        setFirst(false);
    }, [])

    useEffect(() => {
        if(!first){
            buscaDadosFiltro(filtroBanca);
            buscaDadosFiltro(filtroMateria);
            buscaDadosFiltro(filtroAssuntos);
            buscaDadosFiltro(filtroProfessores);
            buscaDadosFiltro(filtroTipos);
            localStorage.setItem(Config.filtroProvasSelecionadas, JSON.stringify(selectedProvas));
        }
    }, [selectedProvas]);

    useEffect(() => {
        if(!first){
            buscaDadosFiltro(filtroProva);
            buscaDadosFiltro(filtroMateria);
            buscaDadosFiltro(filtroAssuntos);
            buscaDadosFiltro(filtroProfessores);
            buscaDadosFiltro(filtroTipos);
            localStorage.setItem(Config.filtroBancasSelecionadas, JSON.stringify(selectedBancas));
        }
    }, [selectedBancas]);

    useEffect(() => {
        if(!first){
            buscaDadosFiltro(filtroBanca);
            buscaDadosFiltro(filtroProva);
            buscaDadosFiltro(filtroAssuntos);
            buscaDadosFiltro(filtroProfessores);
            buscaDadosFiltro(filtroTipos);
            localStorage.setItem(Config.filtroMateriasSelecionadas, JSON.stringify(selectedMaterias));
        }
    }, [selectedMaterias]);

    useEffect(() => {
        if(!first){
            buscaDadosFiltro(filtroBanca);
            buscaDadosFiltro(filtroProva);
            buscaDadosFiltro(filtroMateria);
            buscaDadosFiltro(filtroProfessores);
            buscaDadosFiltro(filtroTipos);
            localStorage.setItem(Config.filtroAssuntosSelecionadas, JSON.stringify(selectedAssuntos));
        }
    }, [selectedAssuntos]);

    useEffect(() => {
        if(!first){
            buscaDadosFiltro(filtroBanca);
            buscaDadosFiltro(filtroProva);
            buscaDadosFiltro(filtroMateria);
            buscaDadosFiltro(filtroProfessores);
            buscaDadosFiltro(filtroTipos);
            localStorage.setItem(Config.filtroAssuntosSelecionadas, JSON.stringify(selectedAssuntos));
        }
    }, [selectedAssuntos]);

    useEffect(() => {
        if(!first){
            buscaDadosFiltro(filtroBanca);
            buscaDadosFiltro(filtroProva);
            buscaDadosFiltro(filtroMateria);
            buscaDadosFiltro(filtroAssuntos);
            buscaDadosFiltro(filtroTipos);
            localStorage.setItem(Config.filtroProfessoresSelecionadas, JSON.stringify(selectedProfessores));
        }
    }, [selectedProfessores]);

    useEffect(() => {
        if(!first){
            buscaDadosFiltro(filtroBanca);
            buscaDadosFiltro(filtroProva);
            buscaDadosFiltro(filtroMateria);
            buscaDadosFiltro(filtroAssuntos);
            buscaDadosFiltro(filtroProfessores);
            localStorage.setItem(Config.filtroTiposSelecionados, JSON.stringify(selectedtipos));
        }
    }, [selectedtipos]);

    const handleChangeSelectProva = (selectedOptions, event) => {
        setSelectedProvas(selectedOptions);
    }

    const handleChangeSelectMateria = (selectedOptions, event) => {
        setSelectedMaterias(selectedOptions);
    }

    const handleChangeSelectBanca = async (selectedOptions, event) => {
        setSelectedBancas(selectedOptions);
    }

    const handleChangeSelectAssunto = (selectedOptions, event) => {
        setSelectedAssuntos(selectedOptions);
    }

    const handleChangeSelectProfessor = (selectedOptions, event) => {
        setSelectedProfessores(selectedOptions);
    }

    const handleChangeSelectTipo = (selectedOptions, event) => {
        setSelectedTipos(selectedOptions);
    }

    function montaBusca(){
        var retorno = MontaFiltrosLocalSession();

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
        if(tipo == filtroProfessores)
            return !showProfessores;
        if(tipo == filtroTipos)
            return !showTipos;
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
        else if(tipo == filtroAssuntos){
            url = '/Prova/GetAllAssuntos';
        }
        else if(tipo == filtroProfessores){
            url = '/Avaliacao/getProfessores';
        }
        else{
            url = '/Prova/GetAllTipos';
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
                else if(tipo ==filtroAssuntos){
                    setAssuntos(t);
                }
                else if(tipo == filtroProfessores){
                    setProfessores(t);   
                }
                else{
                    setTipos(t);
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
        LimpaFiltrosLocalSession();
        buscaQuestoesFiltrando();
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
                        showProfessores ? 
                        <>
                            <h4>Professor:</h4>
                            <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={professores} value={selectedProfessores} isMulti onChange={handleChangeSelectProfessor} />
                        </>
                        :<></>
                    }

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

                    {
                        showTipos ?
                        <>
                            <h4>Tipos de avaliação:</h4>
                            <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={tipos} value={selectedtipos} isMulti onChange={handleChangeSelectTipo} />
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