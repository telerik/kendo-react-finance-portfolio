import * as React from 'react';
import { useParams } from 'react-router-dom';

export const DetailedChart = () => {
    const { symbol } = useParams();
    console.log(symbol);
    return (
        <div>
            {symbol}
        </div>
    )
}