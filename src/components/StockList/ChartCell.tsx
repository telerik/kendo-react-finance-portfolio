import * as React from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartValueAxis, ChartValueAxisItem, ChartArea, ChartCategoryAxis, ChartCategoryAxisItem } from '@progress/kendo-react-charts';
import { dataService } from '../../services';
import { GridCellProps } from '@progress/kendo-react-grid';

export const ChartCell = (props: GridCellProps) => {
    let data = dataService.getSymbol(props.dataItem.symbol)
    let currentHours = 0
    let closeData = data.map(item => {
        if (item.date.getHours() !== currentHours) {
            currentHours = item.date.getHours()
            return item.close
        }
    })
    let filtered = closeData.filter(item => item)
    let color = filtered[0] < filtered[filtered.length - 1] ? '#5CB85C' : '#D9534F';
    return (
        <td>
            {/* <Chart style={{ height: 70 }} transitions={false}>
                <ChartValueAxis>
                    <ChartValueAxisItem visible={false} majorGridLines={{ visible: false }} axisCrossingValue={color === '#5CB85C' ? null : 1000} />
                </ChartValueAxis>
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem majorGridLines={{ visible: false }} visible={false} />
                </ChartCategoryAxis>
                <ChartSeries>
                    <ChartSeriesItem data={filtered} type='line' markers={{ visible: false }} color={color} />
                    <ChartSeriesItem data={filtered} type='area' markers={{ visible: false }} color={color} opacity={0.2} />
                </ChartSeries>
            </Chart> */}
        </td>
    )
}