import './graficoPie.css';
import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

export default function BasicPie({dados}) {
  return (
    <div className='grafico'>
        <PieChart
            series={[
                {
                  data: dados,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                },
            ]}
            width={500}
            height={200}
            margin={{ right: 250 }}
        />
    </div>
  );
}
