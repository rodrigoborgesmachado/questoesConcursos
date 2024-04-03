import './graficoPie.css';
import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

export default function BasicPie({dados}) {
  return (
    <div className='grafico'>
        <PieChart
            series={[
                {
                    data: dados
                },
            ]}
            width={400}
            height={200}
            margin={{ right: 250 }}
        />
    </div>
  );
}
