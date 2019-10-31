import * as React from 'react';
import { classNames } from '@progress/kendo-react-common';
import { Button } from '@progress/kendo-react-buttons';
import { AutoComplete } from '@progress/kendo-react-dropdowns';
import { Popup } from '@progress/kendo-react-popup';
import { AddSymbol } from './AddSymbol';

export interface AddRemoveSymbolProps {
    className?: string;
    onDelete?: any;
}

export const AddRemoveSymbol = (props: AddRemoveSymbolProps) => {
    const [show, setShow] = React.useState<boolean>(false);
    const addBtn = React.useRef<Button>(null);

    const handleRemoveClick = React.useCallback(
        () => {
            if (props.onDelete) {
                props.onDelete.call(undefined);
            }
        },
        [props.onDelete]
    )
    const handleAddClick = React.useCallback(
        () => {
            setShow(!show)
        },
        [show, setShow]
    )
    return (
        <div className={classNames(props.className)}>
            <Button iconClass='k-icon k-i-delete' onClick={handleRemoveClick}>Remove</Button>
            &nbsp;
            <Button ref={addBtn} iconClass="k-icon k-i-plus" onClick={handleAddClick}>Add</Button>
            <Popup show={show} anchor={addBtn.current && addBtn.current.element ? addBtn.current.element : undefined}>
                <AddSymbol />
            </Popup>
            {/* <DropDownList data={dropDownData}
                textField='symbol'
                valueRender={AddButtonRender}
                className={styles["dropdownlist-add-new"]}
                style={{ width: 60 }}
                popupSettings={{ width: "300px" }}
                onClose={handleDropDownClose}
            /> */}
        </div>
    )
}