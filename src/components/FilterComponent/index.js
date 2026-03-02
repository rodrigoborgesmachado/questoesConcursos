import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { LimpaFiltrosLocalSession } from '../../services/functions.js';
import PacmanLoader from '../PacmanLoader/PacmanLoader.js';
import { filtersToSelectOptions } from '../../services/listingQueryState.js';

const filtroBanca = 1;
const filtroProva = 2;
const filtroMateria = 3;
const filtroAssuntos = 4;
const filtroProfessores = 5;
const filtroTipos = 6;

function buildEmptyFilters() {
    return {
        provas: [],
        materias: [],
        bancas: [],
        assuntos: [],
        professor: [],
        tipos: [],
    };
}

function FilterComponent({
    buscaQuestoesFiltrando,
    setFiltro,
    showBancas = true,
    showMaterias = true,
    showAssuntos = true,
    showProvas = true,
    showProfessores = false,
    showTipos = true,
    filters = null,
    onApply = null,
    persistInLocalStorage = true,
}) {
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const [loadding, setLoadding] = useState(true);
    const [bancas, setBancas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [assuntos, setAssuntos] = useState([]);
    const [provas, setProvas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [tipos, setTipos] = useState([]);

    const hasExternalFilters = filters !== null;

    const selectedFromProps = useMemo(() => ({
        bancas: filtersToSelectOptions(filters?.bancas || []),
        materias: filtersToSelectOptions(filters?.materias || []),
        assuntos: filtersToSelectOptions(filters?.assuntos || []),
        provas: filtersToSelectOptions(filters?.provas || []),
        professores: filtersToSelectOptions(filters?.professor || []),
        tipos: filtersToSelectOptions(filters?.tipos || []),
    }), [filters]);

    const [selectedBancas, setSelectedBancas] = useState(
        hasExternalFilters
            ? selectedFromProps.bancas
            : (localStorage.getItem(Config.filtroBancasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroBancasSelecionadas)) : []),
    );
    const [selectedMaterias, setSelectedMaterias] = useState(
        hasExternalFilters
            ? selectedFromProps.materias
            : (localStorage.getItem(Config.filtroMateriasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroMateriasSelecionadas)) : []),
    );
    const [selectedAssuntos, setSelectedAssuntos] = useState(
        hasExternalFilters
            ? selectedFromProps.assuntos
            : (localStorage.getItem(Config.filtroAssuntosSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroAssuntosSelecionadas)) : []),
    );
    const [selectedProvas, setSelectedProvas] = useState(
        hasExternalFilters
            ? selectedFromProps.provas
            : (localStorage.getItem(Config.filtroProvasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroProvasSelecionadas)) : []),
    );
    const [selectedProfessores, setSelectedProfessores] = useState(
        hasExternalFilters
            ? selectedFromProps.professores
            : (localStorage.getItem(Config.filtroProfessoresSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroProfessoresSelecionadas)) : []),
    );
    const [selectedTipos, setSelectedTipos] = useState(
        hasExternalFilters
            ? selectedFromProps.tipos
            : (localStorage.getItem(Config.filtroTiposSelecionados) ? JSON.parse(localStorage.getItem(Config.filtroTiposSelecionados)) : []),
    );
    const [first, setFirst] = useState(true);

    function getCurrentFiltersValues() {
        return {
            provas: selectedProvas.map((item) => item.value),
            materias: selectedMaterias.map((item) => item.value),
            bancas: selectedBancas.map((item) => item.value),
            assuntos: selectedAssuntos.map((item) => item.value),
            professor: selectedProfessores.map((item) => item.value),
            tipos: selectedTipos.map((item) => item.value),
        };
    }

    function mountQuery(filtersValues) {
        const current = filtersValues || getCurrentFiltersValues();
        let retorno = '';

        if (current.provas.length > 0) {
            retorno += `&provas=${current.provas.join(';')}`;
        }

        if (current.materias.length > 0) {
            retorno += `&materias=${current.materias.join(';')}`;
        }

        if (current.bancas.length > 0) {
            retorno += `&bancas=${current.bancas.join(';')}`;
        }

        if (current.assuntos.length > 0) {
            retorno += `&assuntos=${current.assuntos.join(';')}`;
        }

        if (current.professor.length > 0) {
            retorno += `&professor=${current.professor.join(';')}`;
        }

        if (current.tipos.length > 0) {
            retorno += `&tipos=${current.tipos.join(';')}`;
        }

        return retorno;
    }

    function syncStorage() {
        if (!persistInLocalStorage || hasExternalFilters) {
            return;
        }

        localStorage.setItem(Config.filtroBancasSelecionadas, JSON.stringify(selectedBancas));
        localStorage.setItem(Config.filtroMateriasSelecionadas, JSON.stringify(selectedMaterias));
        localStorage.setItem(Config.filtroAssuntosSelecionadas, JSON.stringify(selectedAssuntos));
        localStorage.setItem(Config.filtroProvasSelecionadas, JSON.stringify(selectedProvas));
        localStorage.setItem(Config.filtroProfessoresSelecionadas, JSON.stringify(selectedProfessores));
        localStorage.setItem(Config.filtroTiposSelecionados, JSON.stringify(selectedTipos));
    }

    function jump(tipo) {
        if (tipo === filtroAssuntos) {
            return !showAssuntos;
        }
        if (tipo === filtroBanca) {
            return !showBancas;
        }
        if (tipo === filtroMateria) {
            return !showMaterias;
        }
        if (tipo === filtroProva) {
            return !showProvas;
        }
        if (tipo === filtroProfessores) {
            return !showProfessores;
        }

        return !showTipos;
    }

    async function buscaDadosFiltro(tipo, explicitFilters = null) {
        let url = '';

        if (jump(tipo)) {
            return;
        }

        if (tipo === filtroBanca) {
            url = '/Prova/GetAllBancas';
        }
        else if (tipo === filtroProva) {
            url = '/Prova/GetAllProvasName';
        }
        else if (tipo === filtroMateria) {
            url = '/Prova/GetAllMaterias';
        }
        else if (tipo === filtroAssuntos) {
            url = '/Prova/GetAllAssuntos';
        }
        else if (tipo === filtroProfessores) {
            url = '/Avaliacao/getProfessores';
        }
        else {
            url = '/Prova/GetAllTipos';
        }

        await api.get(url + '?1=1' + mountQuery(explicitFilters))
            .then((response) => {
                if (response.data.success) {
                    const options = response.data.object.map((element) => ({
                        value: element,
                        label: element,
                    }));

                    if (tipo === filtroBanca) {
                        setBancas(options);
                    }
                    else if (tipo === filtroProva) {
                        setProvas(options);
                    }
                    else if (tipo === filtroMateria) {
                        setMaterias(options);
                    }
                    else if (tipo === filtroAssuntos) {
                        setAssuntos(options);
                    }
                    else if (tipo === filtroProfessores) {
                        setProfessores(options);
                    }
                    else {
                        setTipos(options);
                    }
                }
                else {
                    navigate('/', { replace: true });
                    toast.warn('Erro ao buscar filtros');
                }
            })
            .catch(() => {
                navigate('/', { replace: true });
                toast.warn('Erro ao buscar filtros');
            });
    }

    async function fetchAllFilters(explicitFilters = null) {
        await Promise.all([
            buscaDadosFiltro(filtroBanca, explicitFilters),
            buscaDadosFiltro(filtroProva, explicitFilters),
            buscaDadosFiltro(filtroMateria, explicitFilters),
            buscaDadosFiltro(filtroAssuntos, explicitFilters),
            buscaDadosFiltro(filtroProfessores, explicitFilters),
            buscaDadosFiltro(filtroTipos, explicitFilters),
        ]);
    }

    useEffect(() => {
        async function initialize() {
            setLoadding(true);
            await fetchAllFilters(getCurrentFiltersValues());
            setLoadding(false);
            setFirst(false);
        }

        initialize();
    }, []);

    useEffect(() => {
        if (!hasExternalFilters) {
            return;
        }

        setSelectedBancas(selectedFromProps.bancas);
        setSelectedMaterias(selectedFromProps.materias);
        setSelectedAssuntos(selectedFromProps.assuntos);
        setSelectedProvas(selectedFromProps.provas);
        setSelectedProfessores(selectedFromProps.professores);
        setSelectedTipos(selectedFromProps.tipos);
    }, [hasExternalFilters, selectedFromProps]);

    useEffect(() => {
        if (first) {
            return;
        }

        const currentFilters = getCurrentFiltersValues();
        syncStorage();
        fetchAllFilters(currentFilters);
    }, [selectedBancas, selectedMaterias, selectedAssuntos, selectedProvas, selectedProfessores, selectedTipos]);

    function handleApply() {
        const currentFilters = getCurrentFiltersValues();
        const mounted = mountQuery(currentFilters);

        setFiltro(mounted);

        if (onApply) {
            onApply(currentFilters);
        }
        else {
            buscaQuestoesFiltrando(currentFilters);
        }
    }

    function clearSelections() {
        setSelectedBancas([]);
        setSelectedMaterias([]);
        setSelectedAssuntos([]);
        setSelectedProvas([]);
        setSelectedProfessores([]);
        setSelectedTipos([]);
    }

    function limparFiltro() {
        const emptyFilters = buildEmptyFilters();

        if (persistInLocalStorage && !hasExternalFilters) {
            LimpaFiltrosLocalSession();
        }

        clearSelections();
        setFiltro('');

        if (onApply) {
            onApply(emptyFilters);
        }
        else {
            buscaQuestoesFiltrando(emptyFilters);
        }
    }

    if (loadding) {
        return (
            <PacmanLoader />
        );
    }

    return (
        <div className='global-pageContainer-left'>
            <div className='contextModal global-modal'>
                <div className='bodymodal'>
                    <h3>Filtros</h3>
                </div>
                <div className='separator separator--withMargins'></div>
                <div className='filtros-questoes'>
                    {
                        showProfessores
                            ? <>
                                <h4>Professor:</h4>
                                <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={professores} value={selectedProfessores} isMulti onChange={setSelectedProfessores} />
                            </>
                            : <></>
                    }

                    {
                        showBancas
                            ? <>
                                <h4>Bancas:</h4>
                                <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={bancas} value={selectedBancas} isMulti onChange={setSelectedBancas} />
                            </>
                            : <></>
                    }

                    {
                        showProvas
                            ? <>
                                <h4>Provas:</h4>
                                <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={provas} value={selectedProvas} isMulti onChange={setSelectedProvas} />
                            </>
                            : <></>
                    }

                    {
                        showMaterias
                            ? <>
                                <h4>Matérias:</h4>
                                <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={materias} value={selectedMaterias} isMulti onChange={setSelectedMaterias} />
                            </>
                            : <></>
                    }

                    {
                        showAssuntos
                            ? <>
                                <h4>Assuntos:</h4>
                                <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={assuntos} value={selectedAssuntos} isMulti onChange={setSelectedAssuntos} />
                            </>
                            : <></>
                    }

                    {
                        showTipos
                            ? <>
                                <h4>Tipos de avaliação:</h4>
                                <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={tipos} value={selectedTipos} isMulti onChange={setSelectedTipos} />
                            </>
                            : <></>
                    }
                </div>
                <div className='botoesModalFiltro'>
                    <button className='global-button global-button--transparent' onClick={limparFiltro}>Limpar</button>
                    <button className='global-button global-button--transparent' onClick={handleApply}>Filtrar</button>
                </div>
            </div>
        </div>
    );
}

export default FilterComponent;
