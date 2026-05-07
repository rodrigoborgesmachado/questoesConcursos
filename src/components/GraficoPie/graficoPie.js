import './graficoPie.css';
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

function useChartWidth(defaultWidth = 440) {
  const ref = React.useRef(null);
  const [width, setWidth] = React.useState(defaultWidth);

  React.useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const updateWidth = () => {
      setWidth(Math.max(280, ref.current.getBoundingClientRect().width));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

export default function BasicPie({dados = []}) {
  const [chartRef, chartWidth] = useChartWidth();
  const isCompact = chartWidth < 420;

  return (
    <div className='grafico' ref={chartRef}>
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
            width={chartWidth}
            height={220}
            margin={isCompact ? { right: 0 } : { right: 170 }}
            slotProps={{
              legend: {
                hidden: isCompact,
              },
            }}
        />
    </div>
  );
}
