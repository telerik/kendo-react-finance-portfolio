import * as React from 'react';
import { Grid, GridColumn, GridSelectionChangeEvent, GridRowClickEvent } from '@progress/kendo-react-grid';
import { dataService } from '../../services';
import { useHistory } from "react-router-dom";
import { ChangeCell } from './ChangeCell';
import { NumberCell } from './NumberCell';
import { ChartCell } from './ChartCell';
import { CheckboxCell } from './CheckboxCell';
import { PriceHeaderCell } from './PriceHeaderCell';
import { AvgVolumeHeaderCell } from './AvgVolumeHeaderCell';
import { PERatioHeaderCell } from './PERatioHeaderCell';
import { PriceCell } from './PriceCell';
import styles from './stock-list.module.scss';
import { SectorContext } from '../../context/SectorContext';
import { SymbolsContext } from '../../context/SymbolsContext';


export const StockList: React.FunctionComponent = () => {
    const history = useHistory();
    const { sector } = React.useContext(SectorContext);
    const { symbols, onSelectedSymbolsChange } = React.useContext(SymbolsContext);
    const [data, setData] = React.useState<any[]>([]);

    const fetchData = async () => {
        const newData = await dataService.getSectorSymbol(sector);
        setData(newData.filter((d: any) => symbols[sector].some((s: string) => s === d.symbol)))
    }

    const handleSelectionChange = React.useCallback(
        (event: GridSelectionChangeEvent) => {
            let newSelectData = data.map(item => {
                if (item.symbol === event.dataItem.symbol) {
                    item.selected = !event.dataItem.selected
                }
                return item
            })

            if (onSelectedSymbolsChange) {
                onSelectedSymbolsChange.call(undefined, newSelectData.filter((i) => i.selected === true).map((i) => i.symbol))
            }

            setData(newSelectData);
        }, [data, setData])

    const handleRowClick = React.useCallback(
        (event: GridRowClickEvent) => {
            let newSelectData = data.map(item => ({ ...item, selected: item.symbol === event.dataItem.symbol }))
            setData(newSelectData);
            history.push(`/stocks/${event.dataItem.symbol}`);
        },
        [data, setData])

    React.useEffect(() => { fetchData() }, [sector, symbols]);

    const chartCell = React.useMemo(
        () => ChartCell,
        [data]
    )

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
                <GridColumn field="name" title="Name" className={styles['name-cell']} width={200} />
                <GridColumn field="price" title="Price" className={styles['price-cell']} cell={PriceCell} headerCell={PriceHeaderCell} />
                <GridColumn field="day_change" title="Change" cell={ChangeCell} />
                <GridColumn field="change_pct" title="% Change" cell={ChangeCell} />
                <GridColumn field="volume" title="Volume" cell={NumberCell} />
                <GridColumn field="volume_avg" title="Avg Vol" cell={NumberCell} headerCell={AvgVolumeHeaderCell} />
                <GridColumn field="market_cap" title="Market Cap" cell={NumberCell} />
                <GridColumn field="pe" title="PE Ratio (TTM)" headerCell={PERatioHeaderCell} />
                <GridColumn cell={chartCell} title='1 Day Chart' width={200} />
            </Grid>
        </>
    )
}