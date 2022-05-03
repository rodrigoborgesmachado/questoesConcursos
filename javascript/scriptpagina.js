function topo(){
	parent.scroll(0,0);
}

function MontaOrdemLetras(i){
    var retorno = '';
    switch(i){
        case 0: 
            retorno = 'A';
            break;

        case 1: 
            retorno = 'B';
            break;

        case 2: 
            retorno = 'C';
            break;

        case 3: 
            retorno = 'D';
            break;    

        case 4: 
            retorno = 'E';
            break;    
        default:
            retorno = 'F';
            break;    
    }
    
    return retorno;
}

function showImageUri(div, uri){
    document.getElementById(div).src = URL.createObjectURL(dataURLtoFile(uri, 'anexo'));
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}

function AbreUrlNewTab(url){
    window.open(url, '_blank').focus();
}

function MontaRespostas(questao){
    var html = ``;

    html += `<div class="row">`;

    for(i = 0; i < questao.respostas.length;i++){
        html+= `    <div class="col-sm-8">`;
        html += `       <input type="radio" id="html" name="questao${questao.Codigo}" value="HTML" onclick="ValidaResposta(${questao.respostas[i].Codigo})">`
        html+= `        ${MontaOrdemLetras(i)} - ${questao.respostas[i].Textoresposta}`;
        if(!questao.respostas[i].Textoresposta.includes('<img src="#" alt="Anexo" id="divAnexoResposta'))
        {
            if(questao.respostas[i].anexos != null){
                for(j = 0; j < questao.respostas[i].anexos.length;j++){
                    html+= `    <img src="#" alt="Anexo" id="divAnexoResposta${i}${j}"/><br>`;
                }
            }
        }
        else{
            html+= `        ${MontaOrdemLetras(i)} - ${questao.respostas[i].Textoresposta}`;
        }
        html+= `    </div>`;
    }
    html+= `</div>`;

    return html;
}

function ValidaResposta(Codigoresposta){
    var xhr = new XMLHttpRequest();
    openLoader();
    var dados = JSON.stringify({Codigoresposta});

    xhr.open("POST", "http://questoesconcurso.sunsalesystem.com.br/PHP/ValidaResposta.php?codigoResposta=" + Codigoresposta);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.addEventListener("load", function() {
        if (xhr.status == 200) {
            let radios = document.getElementsByName('questaoundefined');
            for( i = 0; i < radios.length; i++ ) {
                radios[i].disabled = true;
            }
            
            var retorno = JSON.parse(xhr.responseText);
            if(!retorno.RespostaCorreta){
                informa('Resposta incorreta', BuscarQuestao);
            }
            else{
                totalCertas++;
                PreenchInfos();
                informa('Resposta correta', BuscarQuestao);
            }
        } else {
            alert('Não foi possível inserir e validar a resposta');
        }
        removeLoader();
    }
    );

    xhr.send(dados);
}

function MontaQuestaoApresentacao(questao){
    var html = '';
    html+= `<div class="row">`;
    html+= `    <div class="col-sm-10">`;
    html+= `        Matéria: <b>` + questao.questao.Materia + `</b>`;
    html+= `    </div>`;
    html+= `    <div class="col-sm-2">`;
    html+= `        <button class="buttonInicio" onclick="BuscaInfoProva(` + questao.Codigoprova + `);">Dados Prova</button>`;
    html+= `    </div>`;
    html+= `</div>`;
    html+= `<div class="row">`;
    html+= `    <div class="col-sm-12">`;
    html+= `        ` + questao.questao.Campoquestao;
    html+= `    </div>`;
    html+= `    <div class="col-sm-12">`;

    if(!questao.questao.Campoquestao.includes('<img src="#" alt="Anexo" id="divAnexo'))
    {
        for(i = 0; i < questao.questao.anexosQuestao.length;i++){
            html+= `    <img src="#" alt="Anexo" id="divAnexo${i}"/><br>`;
        }
    }
    
    html+= `    </div>`;
    html+= `    <div class="col-sm-12">`;
    html+= `        ` + MontaRespostas(questao);
    html+= `    </div>`;
    html+= `</div>`;

    return html;
}

function BuscarQuestao(){
    var xhr = new XMLHttpRequest();
    openLoader();
    xhr.open("GET", "http://questoesconcurso.sunsalesystem.com.br/PHP/BuscarQuestaoAleatoria.php");

    xhr.addEventListener("load", function() {
        if (xhr.status == 200) {
            totalQuestoes++;
            PreenchInfos();

            var obj = JSON.parse(xhr.responseText);
            document.getElementById('lugarParaConta').innerHTML = MontaQuestaoApresentacao(obj.lista[0]);

            if(obj.lista[0].questao.anexosQuestao != null){
                for(i = 0; i < obj.lista[0].questao.anexosQuestao.length;i++){
                    showImageUri('divAnexo' + i, obj.lista[0].questao.anexosQuestao[i].Anexo);
                }
            }

            for(i = 0; i < obj.lista[0].respostas.length;i++){
                if(obj.lista[0].respostas[i].anexos != null){
                    for(j = 0; j < obj.lista[0].respostas[i].anexos.length;j++){
                        showImageUri('divAnexoResposta' + i + '' + j, obj.lista[0].respostas[i].anexos[j].Anexo);
                    }
                }
            }

            document.getElementById('LugarProximaQuestao').innerHTML = `
                    <div class="col-sm-2">
                        <button class="buttonInicio" onclick="Finalizar();">Encerrar</button>
                    </div>
                    <div class="col-sm-5">
                    </div>
                    <div class="col-sm-2">
                    </div>
                    <div class="col-sm-1">
                    </div>
                    <div class="col-sm-2">
                        <button class="buttonInicio" onclick="BuscarQuestao();">Próxima</button>
                    </div>
                `;
        } else {
            alert('Erro ao buscar questões');
        }
        removeLoader();
    }
    );

    xhr.send();
}

function BuscaInfoProva(codigoProva){
    var xhr = new XMLHttpRequest();
    openLoader();
    xhr.open("GET", "http://questoesconcurso.sunsalesystem.com.br/PHP/BuscarDadosProva.php?codigoProva=" + codigoProva);

    xhr.addEventListener("load", function() {
        if (xhr.status == 200) {
            var obj = JSON.parse(xhr.responseText);
            var html = '';
            html+= `<div class="row">`;
            html+= `    <div class="col-sm-10">`;
            html+= `        Prova: <b>` + obj.lista[0].Nomeprova + `</b>`;
            html+= `    </div>`;
            html+= `    <div class="col-sm-10">`;
            html+= `        Local: <b>` + obj.lista[0].Local + `</b>`;
            html+= `    </div>`;
            html+= `    <div class="col-sm-10">`;
            html+= `        Tipo Prova: <b>` + obj.lista[0].Tipoprova + `</b>`;
            html+= `    </div>`;
            html+= `    <div class="col-sm-10">`;
            html+= `        Banca: <b>` + obj.lista[0].Banca + `</b>`;
            html+= `    </div>`;
            html+= `    <div class="col-sm-10">`;
            html+= `        Ano: <b>` + obj.lista[0].Dataaplicacao + `</b>`;
            html+= `    </div>`;
            html+= `</div>`;

            informa(html);
        } else {
            alert('Erro ao buscar prova');
        }
        removeLoader();
    }
    );

    xhr.send();
}

function PreencheQuestao(){
    BuscarQuestao();
}

function Finalizar(){
    informa('Você acertou o total de ' + totalCertas + ' em ' + (totalQuestoes--) + ' questões no tempo de ' + MontaTempo() + '!<br>Parabéns!', Inicio);
}

function Inicio(){
    document.location.reload(true);
}