import * as React from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { dataService } from '../services';
import { Chart, ChartSeries, ChartSeriesItem, ChartTooltip, ChartSeriesLabels, ChartTitle, ChartLegend } from '@progress/kendo-react-charts';

export const UserProfile = () => {
    const [data, setData] = React.useState<any[]>([]);
    const fetchData = async () => {
        const newData = await dataService.getAllSymbols();
        const parsedData = newData.map((item: any) => {
            item.proportion = Math.random() / 10;
            return item;
        })
        setData(parsedData)
    }
    const tooltipRender = (props: any) => {
        if (props.point) {
            let symbol = props.point.dataItem.symbol
            let proportion = props.point.dataItem.proportion * 100
            return symbol + " - " + proportion.toPrecision(3);
        }
    }
    React.useEffect(() => { fetchData() }, []);
    return (
        <div className="wrapper-profile">
            <div className="profile-header">
                <h1>My Portfolio</h1>
            </div>
            <div className="d-flex justify-content-center inner-wrapper">
                <div className="inner-section">
                    <div className="avatar">
                        <img src="../images/user.jpg" width="100" alt="Collin Johnson" />
                    </div>
                    <h2>Collin Johnson</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>CURRENT VALUE:</td>
                                <td className="large">$100</td>
                            </tr>
                            <tr>
                                <td>24H CHANGE:</td>
                                <td className="green">$20</td>
                            </tr>
                            <tr>
                                <td>% CHANGE:</td>
                                <td className="green">+1.2</td>
                            </tr>
                            <tr>
                                <td>TOTAL COST:</td>
                                <td>$9,185</td>
                            </tr>
                            <tr>
                                <td>TOTAL PROFIT:</td>
                                <td className="red">$-2,638</td>
                            </tr>
                       </tbody>
                    </table>
                </div>
                <div className="inner-section">
                    <Grid data={data}>
                        <GridColumn field='symbol' title="Symbol" className='symbol-col'/>
                        <GridColumn field='name' title="Name" />
                        <GridColumn field="proportion" title='Proportion' format={"{0:p2}"} />
                    </Grid>
                </div>
                <div className="inner-section">
                    <Chart>
                        <ChartLegend position='bottom'/>
                        <ChartTooltip render={tooltipRender} />
                        <ChartSeries>
                            <ChartSeriesItem data={data} field='proportion' type='pie' />
                        </ChartSeries>
                    </Chart>
                </div>
            </div>
        </div>
    )
}