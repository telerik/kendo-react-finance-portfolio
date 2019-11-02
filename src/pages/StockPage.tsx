import * as React from 'react';
import { Splitter } from '@progress/kendo-react-layout';
import {
    Switch
} from 'react-router-dom';
import { classNames } from '@progress/kendo-react-common';

import styles from '../app.module.scss';
import { Stock } from '../components/Stock/Stock';
import { NavigationRow, Navigation } from '../components/Navigation';
import { AddRemoveSymbol } from '../components/AddRemoveSymbol';
import { StockList } from '../components/StockList';
import { ChangeSector } from '../components/SectorChange';

export const StockPage = () => {
    return (
        <>
            <Splitter
                orientation={'vertical'}
                defaultPanes={[
                    { size: '520px', min: '200px' },
                    {}
                ]}
            >
                <Switch>
                    <div className={classNames(styles.detailed, "pt-4 pb-2")} >
                        <div className="container">
                            <Stock />
                        </div>
                    </div>
                </Switch>
                <div className={classNames(styles.content, 'py-3')} style={{ minHeight: 600 }}>
                    <div className={"container my-3"}>
                        <NavigationRow className="row justify-content-center">
                            <AddRemoveSymbol className="col-4 text-left" />
                            <Navigation className="col-4 flex-grow-1 text-center" />
                            <ChangeSector className="col-4 text-right" />
                        </NavigationRow>
                    </div>
                    <div className="container">
                        <Switch >
                            <StockList />
                        </Switch>
                    </div>
                </div>
            </Splitter>
        </>
    )
}