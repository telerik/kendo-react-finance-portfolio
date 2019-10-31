import * as React from 'react';
import { Grid, GridColumn, GridSelectionChangeEvent, GridRowClickEvent } from '@progress/kendo-react-grid';
import { dataService } from '../../services';
import { useHistory } from "react-router-dom";
import { Button } from '@progress/kendo-react-buttons';
import { ChangeCell } from './ChangeCell';
import { NumberCell } from './NumberCell';
import { ChartCell } from './ChartCell';
import { CheckboxCell } from './CheckboxCell';
import { PriceHeaderCell } from './PriceHeaderCell';
import styles from './stock-list.module.scss';
import { AvgVolumeHeaderCell } from './AvgVolumeHeaderCell';
import { PERatioHeaderCell } from './PERatioHeaderCell';

export interface StockListProps {
    symbols?: string[];
}


export const StockList: React.FunctionComponent<StockListProps> = (props) => {
    const history = useHistory();
    const [data, setData] = React.useState<any[]>([]);
    const [dropDownData, setDropDownData] = React.useState<any[]>([]);

    const fetchData = async () => {
        const newData = await dataService.getAllSymbols();
        setData(newData.slice(0, newData.length / 2))
        setDropDownData(newData.slice(newData.length / 2, newData.length))
    }

    const handleSelectionChange = React.useCallback(
        (event: GridSelectionChangeEvent) => {
            let newSelectData = data.map(item => {
                if (item.symbol === event.dataItem.symbol) {
                    item.selected = !event.dataItem.selected
                }
                return item
            })
            setData(newSelectData);
        }, [data, setData])

    const handleRowClick = React.useCallback(
        (event: GridRowClickEvent) => {
            let newSelectData = data.map(item => ({ ...item, selected: item.symbol === event.dataItem.symbol }))
            setData(newSelectData);
            history.push(`/stocks/${event.dataItem.symbol}`);
        },
        [data, setData])

    React.useEffect(() => { fetchData() }, []);

    return (
        <>
            <Grid
                data={data}
                selectedField="selected"
                onSelectionChange={handleSelectionChange}
                onRowClick={handleRowClick}
            >
                <GridColumn field="selected" width="50px" headerCell={_ => null} cell={CheckboxCell} />
                <GridColumn field="symbol" title="Symbol" className={styles['symbol-cell']} />
                <GridColumn field="name" title="Name" className={styles['name-cell']} width={220} />
                <GridColumn field="price" title="Price" className={styles['price-cell']} headerCell={PriceHeaderCell} />
                <GridColumn field="day_change" title="Change" cell={ChangeCell} />
                <GridColumn field="change_pct" title="% Change" cell={ChangeCell} />
                <GridColumn field="volume" title="Volume" cell={NumberCell} />
                <GridColumn field="volume_avg" title="Avg Vol" cell={NumberCell} headerCell={AvgVolumeHeaderCell} />
                <GridColumn field="market_cap" title="Market Cap" cell={NumberCell} />
                <GridColumn field="pe" title="PE Ratio (TTM)" headerCell={PERatioHeaderCell} />
                <GridColumn cell={ChartCell} title='1 Day Chart' width={200} />
            </Grid>
        </>
    )
}

StockList.defaultProps = {
    symbols: ["SNAP", "TWTR"]
}