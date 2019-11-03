import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import {
  Route,
  BrowserRouter,
  Redirect,
  HashRouter,
  useLocation,
} from 'react-router-dom';

import { UserProfile } from './components/User/UserProfile';

import styles from './app.module.scss';
import { CurrencyContext, CURRENCY } from './context/CurrencyContext';
import { SectorContext, SECTOR } from './context/SectorContext';

/* CLDR Data */

import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import currencyData from 'cldr-core/supplemental/currencyData.json';
import weekData from 'cldr-core/supplemental/weekData.json';

import bgNumbers from 'cldr-numbers-full/main/bg/numbers.json';
import bgLocalCurrency from 'cldr-numbers-full/main/bg/currencies.json';
import bgCaGregorian from 'cldr-dates-full/main/bg/ca-gregorian.json';
import bgDateFields from 'cldr-dates-full/main/bg/dateFields.json';

import usNumbers from 'cldr-numbers-full/main/en/numbers.json';
import usLocalCurrency from 'cldr-numbers-full/main/en/currencies.json';
import usCaGregorian from 'cldr-dates-full/main/en/ca-gregorian.json';
import usDateFields from 'cldr-dates-full/main/en/dateFields.json';

import gbNumbers from 'cldr-numbers-full/main/en-GB/numbers.json';
import gbLocalCurrency from 'cldr-numbers-full/main/en-GB/currencies.json';
import gbCaGregorian from 'cldr-dates-full/main/en-GB/ca-gregorian.json';
import gbDateFields from 'cldr-dates-full/main/en-GB/dateFields.json';

import { load } from '@progress/kendo-react-intl';
import { CustomIntlProvider } from './components/CustomIntlProvider';
import { StockPage } from './pages/StockPage';
import { HeatmapPage } from './pages/HeatmapPage';
import { VirtualizedPage } from './pages/VirtualizedPage';
import { SymbolsContext } from './context/SymbolsContext';

load(
  likelySubtags,
  currencyData,
  weekData,
  bgNumbers,
  bgLocalCurrency,
  bgCaGregorian,
  bgDateFields,
  usNumbers,
  usLocalCurrency,
  usCaGregorian,
  usDateFields,
  gbNumbers,
  gbLocalCurrency,
  gbCaGregorian,
  gbDateFields
);

const Main = () => {
  const locations = useLocation();
  return (
    <>
      <Route path={"/profile"}>
        <UserProfile />
      </Route>
      <Route path="/heatmap">
        <Header />
        <HeatmapPage />
      </Route>
      <Route path="/virtualized">
        <Header />
        <VirtualizedPage />
      </Route>
      <Route path={["/stocks/:symbol?"]}  >
        <Header />
        <StockPage />
      </Route>
      {locations.pathname === '/' ? <Redirect to="/stocks" /> : null}
    </>
  )
}

const App: React.FunctionComponent<any> = () => {
  const selectedSymbols = React.useRef<string[]>([]);
  const [symbols, setSymbols] = React.useState<any>({
    [SECTOR.HEALTHCARE]: ['SYK', "GILD", "DHR", "CVS", "BMY", "TMO", "SNY"],
    [SECTOR.TECHNOLOGY]: ['TWTR', 'AAPL', "MSFT", "SNAP", "NVDA", "CSCO"]
  })
  const [sector, setSector] = React.useState<SECTOR>(SECTOR.TECHNOLOGY);
  const [currency, setCurrency] = React.useState<CURRENCY>(CURRENCY.USD);

  const locales = {
    [CURRENCY.USD]: 'en-US',
    [CURRENCY.BGN]: 'bg-BG',
    [CURRENCY.GBP]: 'en-GB'
  }

  const handleCurrencyChange = React.useCallback(
    (value: CURRENCY) => { setCurrency(value); },
    [setCurrency]
  )

  const handleSectorChange = React.useCallback(
    (value: SECTOR) => { setSector(value); },
    [setSector]
  )

  const handleSymbolsChange = React.useCallback(
    (value: string[]) => { setSymbols({ ...symbols, [sector]: value }); },
    [setSymbols, sector, symbols]
  )

  const handleSelectedSymbolsChange = React.useCallback(
    (value: [string]) => { selectedSymbols.current = value; },
    [selectedSymbols]
  )

  const handleSymbolsRemove = React.useCallback(
    () => {
      const newSymbols = symbols[sector].filter((s: string) => !selectedSymbols.current.some((x) => x === s));
      setSymbols({ ...symbols, [sector]: newSymbols })
    },
    [setSymbols, symbols, sector]
  );

  return (
    <div className="App">
      <CustomIntlProvider locale={locales[currency]}>
        <SymbolsContext.Provider value={{
          symbols, onSymbolsChange: handleSymbolsChange,
          onSelectedSymbolsChange: handleSelectedSymbolsChange,
          onSymbolsRemove: handleSymbolsRemove
        }}>
          <SectorContext.Provider value={{ sector, onSectorChange: handleSectorChange }}>
            <CurrencyContext.Provider value={{ currency, onCurrencyChange: handleCurrencyChange }}>
              <HashRouter basename={process.env.PUBLIC_URL}>
                <main className={styles.main}>
                  <Main />
                </main>
              </HashRouter>
              <Footer />
            </CurrencyContext.Provider>
          </SectorContext.Provider>
        </SymbolsContext.Provider>
      </CustomIntlProvider>
    </div>
  );
}

export default App;
