import * as React from 'react';
import styles from './header.module.scss';
import headerBg from '../../images/header-bg.svg';

export const Header: React.FunctionComponent<any> = () => {
    return (
        <header
            className={styles.header}
            style={{ background: `url(${headerBg})` }}
        >
            <div className="container-fluid pt-4 pb-2">
                <h1 className="mb-0 header-title">Stock watchlist</h1>
                <p>currency in USD</p>
            </div>
        </header >
    )
}