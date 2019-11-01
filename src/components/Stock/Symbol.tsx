import * as React from 'react';
import * as ReactDOM from 'react-dom';

import styles from './stock.module.scss';
import { dataService } from '../../services';
import { useInternationalization } from '@progress/kendo-react-intl';

export interface SymbolProps {
    symbol?: string;
}

export const Symbol = (props: SymbolProps) => {
    const intl = useInternationalization();
    const [data, setData] = React.useState<any>(null);
    const target = document && document.querySelector(".k-splitbar");

    const fetchData = React.useCallback(
        async () => {
            const newData = await dataService.getAllSymbols();
            let current = await newData.find((s: any) => s.symbol === props.symbol);
            if (!current) {
                current = await newData.find((s: any) => s.symbol === 'SNAP');
            }
            setData(current);
        },
        [props.symbol]
    )

    const direction = data && data.length && (data[0].close < data[data.length - 1].close)
        ? 'up'
        : 'down'

    const color = direction === 'down'
        ? '#d9534f'
        : '#5cb85c';

    React.useEffect(() => { fetchData() }, [props.symbol]);

    return target && data
        ? ReactDOM.createPortal(
            <div className={styles['stock']} style={{ backgroundColor: color }}>
                <span className={styles["stock-price"]}>
                    {`${data.symbol} ${intl.formatNumber(data.price, "c")}`}
                </span>
            </div>,
            target
        )
        : null
}

