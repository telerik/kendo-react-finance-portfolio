import * as React from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';

export const DetailedView = () => {
    const [data, setData] = React.useState([]);

    const fetchData = async () => {
        // let response = await fetch("")
        // let result = await response.json();
        // setData(result);
    }

    React.useEffect(() => { fetchData() }, []);

    return (
        <Grid
            data={data}
        >
            <GridColumn />
        </Grid>
    )
}