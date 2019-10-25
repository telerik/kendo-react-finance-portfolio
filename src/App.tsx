import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import {
  Route,
  BrowserRouter,
  Switch
} from 'react-router-dom';

import { DetailedView } from './components/DetailedView';
import { HeatmapView } from './components/HeatmapView';
import { NavigationRow, Navigation } from './components/Navigation';
import { DetailedChart } from './components/DetailedChart';

import styles from './app.module.scss';
import { classNames } from '@progress/kendo-react-common';
import { Splitter } from '@progress/kendo-react-layout';


const App: React.FunctionComponent<any> = () => {
  return (
    <div className="App">
      <Header />
      <BrowserRouter >
        <main className={styles.main}>
          <Splitter
            orientation={'vertical'}
          >
            <Switch >
              <Route path={"/watch/:symbol"}>
                <div className={classNames(styles.detailed, "pt-4 pb-2")} style={{ minHeight: 200 }}>
                  <div className="container">
                    <DetailedChart />
                  </div>
                </div>
              </Route>
            </Switch>
            <div style={{ minHeight: 400 }} className={classNames(styles.content, 'py-3')}>
              <div className={"container my-3"}>
                <NavigationRow className="row">
                  <Navigation className="col flex-grow-1 text-center" />
                </NavigationRow>
              </div>
              <div className="container">
                <Switch >
                  <Route path={"/watch"}>
                    <DetailedView />
                  </Route>
                  <Route path={"/heatmap"}>
                    <HeatmapView />
                  </Route>
                </Switch>
              </div>
            </div>
          </Splitter>

        </main>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
