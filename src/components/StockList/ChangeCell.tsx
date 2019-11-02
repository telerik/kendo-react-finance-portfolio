import * as React from 'react';
import { GridCellProps } from '@progress/kendo-react-grid';
import styles from './stock-list.module.scss';
import { useInternationalization } from '@progress/kendo-react-intl';

export const ChangeCell = (props: GridCellProps) => {
    const intl = useInternationalization();
    const value = props.field && props.dataItem[props.field]

    // console.log(value);
    return (
        <td className={value < 0 ? styles['negative-cell'] : styles['positive-cell']}>
            {props.field === 'change_pct'
                ? intl.formatNumber(value / 100, 'p2')
                : intl.formatNumber(value, 'c')}
        </td>
    )
}