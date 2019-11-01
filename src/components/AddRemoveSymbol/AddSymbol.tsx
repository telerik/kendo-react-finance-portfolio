import * as React from 'react';
import { dataService } from '../../services';
import { AutoComplete } from '@progress/kendo-react-dropdowns';
import styles from './add.module.scss';
import { classNames } from '@progress/kendo-react-common';

export const AddSymbol = () => {
    const [allSymbols, setAllSymbols] = React.useState([]);
    const fetchData = React.useCallback(
        async () => {
            const newData = await dataService.getAllSymbols();
            setAllSymbols(newData);
        },
        []
    );

    React.useEffect(() => { fetchData() }, []);

    console.log(allSymbols);
    return (
        <div className="container-fluid">
            <div className={classNames("row py-1", styles["card-first-row"])}>
                <div className={classNames("col", styles['card-top'])}>
                    <h5 className="mb-0 mr-1">Add New Symbol</h5>
                    <i className="k-icon k-i-close" />
                </div>
            </div>
            <div className="row">
                <p>Enter symbols or company names</p>
            </div>
            <div className="row">
                <div className="col">
                    <AutoComplete
                        data={allSymbols}
                        textField='symbol'
                        // valueRender={AddButtonRender}
                        // className={styles["dropdownlist-add-new"]}
                        // style={{ width: 60 }}
                        // popupSettings={{ width: "400px" }}
                    // onClose={handleDropDownClose}
                    />
                </div>
            </div>
        </div>
    )
}