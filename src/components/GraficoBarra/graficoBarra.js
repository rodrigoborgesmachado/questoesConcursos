import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Config from './../../config.json';

function useChartWidth(defaultWidth = 720) {
  const ref = React.useRef(null);
  const [width, setWidth] = React.useState(defaultWidth);

  React.useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const updateWidth = () => {
      setWidth(Math.max(320, ref.current.getBoundingClientRect().width));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

export function BasicBars({nomes = [], dados = [], height}) {
  const [chartRef, chartWidth] = useChartWidth();
  const chartHeight = height || Math.min(560, Math.max(300, nomes.length * 56));

  return (
    <div className='grafico' ref={chartRef}>
      <BarChart
        xAxis={[{ scaleType: 'band', data: nomes }]}
        series={[{data: dados}]}
        colors={[Config.pallete[0]]}
        width={chartWidth}
        height={chartHeight}
      />
    </div>
  );
}

export function StackedBarChart({nomes = [], pData = [], uData = [], pLabel, uvLabel, height}) {
  const [chartRef, chartWidth] = useChartWidth();
  const chartHeight = height || Math.min(620, Math.max(340, nomes.length * 58));

  return (
    <div className='grafico' ref={chartRef}>
      <BarChart
        width={chartWidth}
        height={chartHeight}
        series={[
          { data: pData, label: pLabel, id: 'pvId', stack: 'total' },
          { data: uData, label: uvLabel, id: 'uvId', stack: 'total' },
        ]}
        colors={[Config.pallete[0], Config.pallete[1]]}
        xAxis={[{ data: nomes, scaleType: 'band' }]}
      />
    </div>
  );
}

export function BarraDoisItensCorretosErrados({itens}){
  function criaInformacoesNomesValores(lista){
    var itens = [];

    lista?.forEach(element => {
        itens.push(element.descricao + ' | Total: ' + (element.certas + element.erradas));
    });

    return itens;
  }

  function criaInformacoesValoresCertos(lista){
      var itens = [];

      lista?.forEach(element => {
          itens.push(element.certas);
      });

      return itens;
  }

  function criaInformacoesValoresErrados(lista){
      var itens = [];

      lista?.forEach(element => {
          itens.push(element.erradas);
      });

      return itens;
  }

  return (
    <StackedBarChart nomes={criaInformacoesNomesValores(itens)} pData={criaInformacoesValoresCertos(itens)} uData={criaInformacoesValoresErrados(itens)} pLabel={'Corretas'} uvLabel = {'Erradas'}/>
  )
}
