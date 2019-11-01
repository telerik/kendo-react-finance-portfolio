import * as React from 'react';
import { GridCellProps } from '@progress/kendo-react-grid';
import { useInternationalization } from '@progress/kendo-react-intl';

export const PriceCell = (props: GridCellProps) => {
    const intl = useInternationalization();
    const value = props.field && props.dataItem[props.field]

    return (
        <td>{intl.formatNumber(value, 'c')}</td>
    )
}