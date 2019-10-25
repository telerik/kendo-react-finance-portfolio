import * as React from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { data as sampleData } from '../data/grid.json';

export interface DetailedViewProps {
    symbols?: string[];
}

export const DetailedView: React.FunctionComponent<DetailedViewProps> = (props) => {
    const [data] = React.useState(sampleData);

    const fetchData = async () => {
        // let response = await fetch("https://api.worldtradingdata.com/api/v1/stock?symbol=SNAP,TWTR,VOD.L&api_token=API_KEY")
        // let result = await response.json();
        // setData(result);
    }

    React.useEffect(() => { fetchData() }, []);

    return (
        <Grid
            data={data}
        >
            <GridColumn field="symbol" title="Symbol" />
            <GridColumn field="name" title="Name" />
            <GridColumn field="price" />
            <GridColumn field="day_change" title="Change" />
            <GridColumn field="change_pct" title="% Change" />
            <GridColumn field="volume" title="Volume" />
            <GridColumn field="volume_avg" title="Avg Vol" />
            <GridColumn field="market_cap" title="Market Cap" />
            <GridColumn field="pe" title="PE Ratio (TTM)" />
        </Grid>
    )
}

DetailedView.defaultProps = {
    symbols: ["SNAP", "TWTR", "VOD.L"]
}