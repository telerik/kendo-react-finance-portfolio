import * as React from 'react';
import { SECTOR } from './SectorContext';

export interface SymbolsContextType {
    symbols: any,
    onSymbolsChange?: any;
    onSelectedSymbolsChange?: any;
    onSymbolsRemove?: any;
}

export const SymbolsContext = React.createContext<SymbolsContextType>({
    symbols: {
        [SECTOR.HEALTHCARE]: [],
        [SECTOR.TECHNOLOGY]: []
    }
})