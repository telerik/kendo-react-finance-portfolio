import * as React from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { dataService } from '../../services';
import { Chart, ChartSeries, ChartSeriesItem, ChartTooltip, ChartSeriesLabels, ChartTitle, ChartLegend } from '@progress/kendo-react-charts';
import useImage from '../../images/user.jpg';
import styles from './user.module.scss';
import { classNames } from '@progress/kendo-react-common';
import { useHistory } from 'react-router-dom';

export const UserProfile = () => {
    const history = useHistory();
    const [data, setData] = React.useState<any[]>([]);
    const fetchData = async () => {
        const newData = await dataService.getAllSymbols();
        const parsedData = newData.map((item: any) => {
            item.proportion = Math.random() / 10;
            return item;
        })
        setData(parsedData)
    }

    const handleBackClick = React.useCallback(
        () => {
            history.goBack();
        },
        []
    )
    const tooltipRender = (props: any) => {
        if (props.point) {
            let symbol = props.point.dataItem.symbol
            let proportion = props.point.dataItem.proportion * 100
            return symbol + " - " + proportion.toPrecision(3);
        }
    }
    React.useEffect(() => { fetchData() }, []);

    return (
        <div className={classNames(styles['wrapper-profile'], 'wrapper-profile')}>
            <div className="profile-header container">
                <div className="row mt-3 mb-2">
                    <div className="col"><h1>My Portfolio</h1></div>
                    <div className="col text-right my-auto">
                        <a className={styles['close-icon']} onClick={handleBackClick}>
                            <i className={classNames('k-icon k-i-close')} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="container inner-wrapper">
                <div className="row">
                    <div className="col-3 text-center">
                        <div className="avatar">
                            <img className={styles['user-icon']} src={useImage} width="100" alt="Collin Johnson" />
                        </div>
                        <h3 className="mb-5">Collin Johnson</h3>
                        <table className={styles['table-small']}>
                            <tbody>
                                <tr>
                                    <td>CURRENT VALUE:</td>
                                    <td className={styles["large"]}>$100</td>
                                </tr>
                                <tr>
                                    <td>24H CHANGE:</td>
                                    <td className={styles["green"]}>$20</td>
                                </tr>
                                <tr>
                                    <td>% CHANGE:</td>
                                    <td className={styles["green"]}>+1.2</td>
                                </tr>
                                <tr>
                                    <td>TOTAL COST:</td>
                                    <td>$9,185</td>
                                </tr>
                                <tr>
                                    <td>TOTAL PROFIT:</td>
                                    <td className={styles["red"]}>$-2,638</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-5">
                        <Grid data={data}>
                            <GridColumn field='symbol' title="Symbol" className={styles['symbol-cell']} />
                            <GridColumn field='name' title="Name" width={200} />
                            <GridColumn field="proportion" title='Proportion' format={"{0:p2}"} />
                        </Grid>
                    </div>
                    <div className="col-4">
                        <Chart>
                            <ChartLegend position='bottom' />
                            <ChartTooltip render={tooltipRender} />
                            <ChartSeries>
                                <ChartSeriesItem data={data} field='proportion' type='pie' />
                            </ChartSeries>
                        </Chart>
                    </div>
                </div>
            </div>
        </div>
    )
}