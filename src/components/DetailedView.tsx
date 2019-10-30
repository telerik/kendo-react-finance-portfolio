import * as React from 'react';
import { Grid, GridColumn, GridCellProps } from '@progress/kendo-react-grid';
import { dataService } from '../services';
import { Chart, ChartSeries, ChartSeriesItem, ChartValueAxis, ChartValueAxisItem, ChartArea, ChartCategoryAxis, ChartCategoryAxisItem } from '@progress/kendo-react-charts';
import { useHistory } from "react-router-dom";
import { Button } from '@progress/kendo-react-buttons';
export interface DetailedViewProps {
    symbols?: string[];
}

const nFormatter = (num: number) => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}

const ChangeCell = (props: any) => {
    const value = props.dataItem[props.field]
    return (
        <td className={value < 0 ? 'negative-cell' : 'positive-cell'}>
            {value}{props.field === 'change_pct' ? '%' : ''}
        </td>
    )
}

const NumberCell = (props: any) => {
    const value = props.dataItem[props.field]
    return (
        <td>
            {nFormatter(value)}
        </td>
    )
}

class ChartCell extends React.Component<GridCellProps>{
    shouldComponentUpdate(){
        return false;
    }
    render(){
        let data = dataService.getSymbol(this.props.dataItem.symbol)
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
                <Chart style={{ height: 70 }} transitions={false}>
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
                </Chart>
            </td>
        )
    }
}

export const DetailedView: React.FunctionComponent<DetailedViewProps> = (props) => {
    const [data, setData] = React.useState<any[]>([]);
    let history = useHistory()
    const fetchData = async () => {
        const newData = await dataService.getAllSymbols();
        setData(newData)
    }
    const selectionChange = (props: any) => {
        let newSelectData = data.map(item => {
            if(item.symbol === props.dataItem.symbol){
                item.selected = !props.dataItem.selected
            }
            return item
        })
        setData(newSelectData);
    }
    const navigateTo = (props: any) => {
        let newSelectData = data.map(item => {
            if(item.symbol === props.dataItem.symbol){
                item.selected = true
            } else {
                item.selected = false
            }
            return item
        })
        setData(newSelectData);
        history.push(`/watch/${props.dataItem.symbol}`);
    }
    const deleteSelected = () => {
        let newData = data.map(item=> {
            if(!item.selected){
                return item;
            }
        })
        let filtered = newData.filter(item => item)
        setData(filtered);
    }
    React.useEffect(() => { fetchData() }, []);
    return (
        <>
            <Button iconClass='k-i-delete' onClick={deleteSelected}>Remove</Button>
            <Grid
                data={data}
                selectedField="selected"
                onSelectionChange={selectionChange}
                onRowClick={navigateTo}
            >
                <GridColumn field="selected" width="50px" headerCell={props => null}/>
                <GridColumn field="symbol" title="Symbol" className='symbol-cell' />
                <GridColumn field="name" title="Name" />
                <GridColumn field="price" className='price-cell' />
                <GridColumn field="day_change" title="Change" cell={ChangeCell} />
                <GridColumn field="change_pct" title="% Change" cell={ChangeCell} />
                <GridColumn field="volume" title="Volume" cell={NumberCell} />
                <GridColumn field="volume_avg" title="Avg Vol" cell={NumberCell} />
                <GridColumn field="market_cap" title="Market Cap" cell={NumberCell} />
                <GridColumn field="pe" title="PE Ratio (TTM)" />
                <GridColumn cell={ChartCell} width={200} title='1 Day Chart' />
            </Grid>
        </>
    )
}

DetailedView.defaultProps = {
    symbols: ["SNAP", "TWTR"]
}