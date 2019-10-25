import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import styles from './app.module.scss';
import {
  Route,
  BrowserRouter,
  Switch
} from 'react-router-dom';
import { DetailedView } from './components/DetailedView';
import { HeatmapView } from './components/HeatmapView';
import { NavigationRow, Navigation } from './components/Navigation';


const App: React.FunctionComponent<any> = () => {
  return (
    <div className="App">
      <Header />
      <BrowserRouter >
        <main className={styles.main}>
          <Switch >
            <Route path={"/watch/:id"}>
              <DetailedView />
            </Route>
          </Switch>
          <div className="container my-3">
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
        </main>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
