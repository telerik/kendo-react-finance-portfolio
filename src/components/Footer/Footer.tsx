import * as React from 'react';
import styles from './footer.module.scss';
import footerBg from '../../images/footer-bg.svg';

export const Footer = () => {
    return (
        <footer
            className={styles.footer}
            style={{ background: `url(${footerBg})` }}
        >
            <div className="container-fluid">
                <p className=" text-center">
                    Copyright © 2019 Progress Software Corporation and/or its subsidiaries or affiliates.
                </p>
            </div>
        </footer>
    )
}