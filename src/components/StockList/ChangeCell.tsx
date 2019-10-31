import * as React from 'react';
import { GridCellProps } from '@progress/kendo-react-grid';
import styles from './stock-list.module.scss';

export const ChangeCell = (props: GridCellProps) => {
    const value = props.field && props.dataItem[props.field]

    return (
        <td className={value < 0 ? styles['negative-cell'] : styles['positive-cell']}>
            {value}{props.field === 'change_pct' ? ' %' : ''}
        </td>
    )
}