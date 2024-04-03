import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars({nomes, dados}) {
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