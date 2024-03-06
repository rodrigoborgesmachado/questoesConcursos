import Config from './../config.json';

export function customStylesQuestoes(){
    return  {
        content: {
            top: '45%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            border: 0,
            background: '#424242',
            marginRight: '-50%',
            borderRadius: '5px',
            transform: 'translate(-50%, -50%)',
            width: '50%'
        },
    };
}

export function customStyles(){
    return {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            border: '0',
            background: '#424242',
            marginRight: '-50%',
            borderRadius: '5px',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            overflow: 'auto',
            position: 'fixed'
        },
    };
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function MontaFiltrosLocalSession(){
    var bancas = localStorage.getItem(Config.filtroBancasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroBancasSelecionadas)) : [];
    var materias = localStorage.getItem(Config.filtroMateriasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroMateriasSelecionadas)) : [];
    var assuntos = localStorage.getItem(Config.filtroAssuntosSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroAssuntosSelecionadas)) : [];
    var provas = localStorage.getItem(Config.filtroProvasSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroProvasSelecionadas)) : [];
    var professores = localStorage.getItem(Config.filtroProfessoresSelecionadas) ? JSON.parse(localStorage.getItem(Config.filtroProfessoresSelecionadas)) : [];
    var tipos = localStorage.getItem(Config.filtroTiposSelecionados) ? JSON.parse(localStorage.getItem(Config.filtroTiposSelecionados)) : []

    var retorno = '';

    if(provas.length > 0){
        retorno += "&provas=";
        provas.forEach((i, index) => {
            retorno += index > 0 ? ";" + i.value : i.value;
        })
    }

    if(materias.length > 0){
        retorno += "&materias=";
        materias.forEach((i, index) => {
            retorno += index > 0 ? ";" + i.value : i.value;
        })
    }

    if(bancas.length > 0){
        retorno += "&bancas=";
        bancas.forEach((i, index) => {
            retorno += index > 0 ? ";" + i.value : i.value;
        })
    }

    if(assuntos.length > 0){
        retorno += "&assuntos=";
        assuntos.forEach((i, index) => {
            retorno += index > 0 ? ";" + i.value : i.value;
        })
    }

    if(professores.length > 0){
        retorno += "&professor=";
        professores.forEach((i, index) => {
            retorno += index > 0 ? ";" + i.value : i.value;
        })
    }

    if(tipos.length > 0){
        retorno += "&tipos=";
        tipos.forEach((i, index) => {
            retorno += index > 0 ? ";" + i.value : i.value;
        })
    }

    return retorno;
}

export function abreQuestao(codigoQuestao){
    const url = window.location.protocol + '/questoes/codigoquestaounica:' + codigoQuestao + '?id=' + codigoQuestao + '&page=0';
    // Open a new tab with the specified URL
    window.open(url, '_blank');
}