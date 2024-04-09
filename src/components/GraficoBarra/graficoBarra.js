import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export function BasicBars({nomes, dados}) {
  return (
    <div className='grafico'>
      <BarChart
        xAxis={[{ scaleType: 'band', data: nomes }]}
        series={[{data: dados}]}
        width={1000}
        height={700}
      />
    </div>
  );
}

export function StackedBarChart({nomes, pData, uData, pLabel, uvLabel}) {
  return (
    <div className='grafico'>
      <BarChart
        width={1000}
        height={700}
        series={[
          { data: pData, label: pLabel, id: 'pvId', stack: 'total' },
          { data: uData, label: uvLabel, id: 'uvId', stack: 'total' },
        ]}
        xAxis={[{ data: nomes, scaleType: 'band' }]}
      />
    </div>
  );
}

export function BarraDoisItensCorretosErrados({itens}){
  function criaInformacoesNomesValores(lista){
    var itens = new Array();

    lista.forEach(element => {
        itens.push(element.descricao + ' | Total: ' + (element.certas + element.erradas));
    });

    return itens;
  }

  function criaInformacoesValoresCertos(lista){
      var itens = new Array();

      lista.forEach(element => {
          itens.push(element.certas);
      });

      return itens;
  }

  function criaInformacoesValoresErrados(lista){
      var itens = new Array();

      lista.forEach(element => {
          itens.push(element.erradas);
      });

      return itens;
  }

  return (
    <StackedBarChart nomes={criaInformacoesNomesValores(itens)} pData={criaInformacoesValoresCertos(itens)} uData={criaInformacoesValoresErrados(itens)} pLabel={'Corretas'} uvLabel = {'Erradas'}/>
  )
}