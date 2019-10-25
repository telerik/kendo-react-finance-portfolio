import * as React from 'react';
import { ButtonGroup, Button } from '@progress/kendo-react-buttons';
import { classNames } from '@progress/kendo-react-common';
import { Link } from 'react-router-dom';

export interface NavigationProps {
    className?: string;
}

export const Navigation: React.FunctionComponent<NavigationProps> = (props) => {
    return (
        <div className={classNames(props.className)}>
            <ButtonGroup>
                <Link to="/watch"><Button>Result List</Button></Link>
                <Link to="/heatmap"><Button>Heatmap View</Button></Link>
            </ButtonGroup>
        </div>
    )
}