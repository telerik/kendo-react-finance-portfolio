import * as React from 'react';
import styles from './header.module.scss';
import headerBg from '../../images/header-bg.svg';
import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import { CURRENCY, CurrencyContext } from '../../context/CurrencyContext';
import { classNames } from '@progress/kendo-react-common';
import userImg from '../../images/user.jpg';
import { Link } from 'react-router-dom';

const customValueRender = (el: any, value: any) => (
    <el.type
        {...el.props}
        className={classNames(el.props.className, "text-left pl-0")}
    >
        {value
            ? (<>
                <span className="text-left">Currency in {value.name}</span></>)
            : null}

    </el.type>)

export const Header: React.FunctionComponent<any> = () => {
    const { currency, onCurrencyChange } = React.useContext(CurrencyContext);
    const data = [
        { name: 'USD', value: CURRENCY.USD },
        { name: 'BGN', value: CURRENCY.BGN },
        { name: 'GBP', value: CURRENCY.GBP }
    ];

    const handleChange = React.useCallback(
        (event: DropDownListChangeEvent) => {
            if (onCurrencyChange) {
                onCurrencyChange.call(undefined, event.target.value.value)
            }
        },
        [onCurrencyChange]
    )

    return (
        <header
            className={classNames(styles.header, styles['currency-input'])}
            style={{ background: `url(${headerBg})` }}
        >
            <div className="container pt-4 pb-2">
                <div className="row">
                    <div className="col">
                        <h1 className="mb-0 header-title">Stock watchlist</h1>
                        <DropDownList
                            popupSettings={{
                                animate: {
                                    closeDuration: 0
                                }
                            }}
                            data={data}
                            style={{ width: 200 }}
                            value={data.find(c => c.value === currency)}
                            onChange={handleChange}
                            valueRender={customValueRender}
                            textField="name"
                        />
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <Link to="/profile">
                                <img src={userImg} alt="user"/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header >
    )
}